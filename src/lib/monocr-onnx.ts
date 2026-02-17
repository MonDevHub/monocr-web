import * as ort from 'onnxruntime-web';

/**
 * ONNX Runtime Web-based OCR engine for Mon language.
 * Supports WebGPU (fastest), WASM with SIMD, and WASM fallback.
 */
export class MonOcrOnnx {
	private session: ort.InferenceSession | null = null;
	private charset: string = '';
	private readonly TARGET_HEIGHT = 64;
	private readonly TARGET_WIDTH = 1024;

	/**
	 * Initialize the ONNX Runtime session with model and charset.
	 * @param modelPath Path to the ONNX model file
	 * @param charsetPath Path to the charset file
	 */
	async initialize(modelPath: string, charsetPath: string): Promise<void> {
		console.time('ONNX Model Load');

		// Configure ONNX Runtime Wasm paths BEFORE creating session
		ort.env.wasm.wasmPaths = '/wasm/';
		ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;

		// Configure ONNX Runtime for optimal performance
		// Priority: WebGPU > WASM SIMD > WASM
		const sessionOptions: ort.InferenceSession.SessionOptions = {
			executionProviders: ['webgpu', 'wasm'],
			graphOptimizationLevel: 'all',
			enableCpuMemArena: true,
			enableMemPattern: true,
			logSeverityLevel: 3 // Error only
		};

		try {
			// Load charset
			const charsetRes = await fetch(charsetPath);
			if (!charsetRes.ok) throw new Error(`Failed to load charset: ${charsetRes.statusText}`);
			this.charset = (await charsetRes.text()).trim();
			console.log(`✓ Loaded charset: ${this.charset.length} characters`);

			// Load ONNX model
			this.session = await ort.InferenceSession.create(modelPath, sessionOptions);
			console.log(`✓ ONNX Runtime initialized`);
			console.timeEnd('ONNX Model Load');

			// Warm-up inference to JIT-compile kernels
			await this.warmup();
		} catch (error) {
			console.error('ONNX initialization failed:', error);
			throw error;
		}
	}

	/**
	 * Warm-up the model with a dummy input to trigger JIT compilation.
	 */
	private async warmup(): Promise<void> {
		console.time('Model Warmup');
		const dummyData = new Float32Array(1 * 1 * this.TARGET_HEIGHT * this.TARGET_WIDTH).fill(0);
		const dummyTensor = new ort.Tensor('float32', dummyData, [
			1,
			1,
			this.TARGET_HEIGHT,
			this.TARGET_WIDTH
		]);
		await this.session!.run({ input: dummyTensor });
		console.timeEnd('Model Warmup');
	}

	/**
	 * Preprocess image to match model input requirements:
	 * - Resize to 64px height (maintaining aspect ratio) using native Canvas (fast)
	 * - Pad to 1024px width
	 * - Convert to grayscale
	 * - Normalize to [-1, 1]
	 */
	private async preprocessImage(imageData: Uint8Array): Promise<Float32Array> {
		// Decode image using createImageBitmap (async, efficient)
		const blob = new Blob([imageData as any]);
		const imageBitmap = await createImageBitmap(blob);

		// Calculate scaled dimensions
		const scale = this.TARGET_HEIGHT / imageBitmap.height;
		const scaledWidth = Math.min(Math.round(imageBitmap.width * scale), this.TARGET_WIDTH);

		// Use OffscreenCanvas for hardware-accelerated resizing & handling
		const canvas = new OffscreenCanvas(this.TARGET_WIDTH, this.TARGET_HEIGHT);
		const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

		// Fill with white background (padding)
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, this.TARGET_WIDTH, this.TARGET_HEIGHT);

		// Draw image scaled to target height
		ctx.drawImage(imageBitmap, 0, 0, scaledWidth, this.TARGET_HEIGHT);
		imageBitmap.close();

		// Get raw pixel data of the processed (small) image
		const { data } = ctx.getImageData(0, 0, this.TARGET_WIDTH, this.TARGET_HEIGHT);

		// Convert to grayscale and normalize to [-1, 1]
		const float32Data = new Float32Array(this.TARGET_WIDTH * this.TARGET_HEIGHT);

		for (let i = 0; i < float32Data.length; i++) {
			const offset = i * 4;
			// Extract RGB (ignore Alpha)
			const r = data[offset];
			const g = data[offset + 1];
			const b = data[offset + 2];

			// Standard Grayscale: 0.299R + 0.587G + 0.114B
			// But since we want [-1, 1], we map [0, 255] -> [-1, 1]
			// (grayscale / 127.5) - 1.0

			const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
			float32Data[i] = gray / 127.5 - 1.0;
		}

		return float32Data;
	}

	/**
	 * Decode CTC predictions using greedy decoding.
	 */
	private decodePredictions(logits: Float32Array, shape: number[]): string {
		const [batchSize, timeSteps, numClasses] = shape;

		// Greedy decoding: argmax along class dimension
		const predictions: number[] = [];
		for (let t = 0; t < timeSteps; t++) {
			let maxIdx = 0;
			let maxVal = -Infinity;

			for (let c = 0; c < numClasses; c++) {
				const val = logits[t * numClasses + c];
				if (val > maxVal) {
					maxVal = val;
					maxIdx = c;
				}
			}

			predictions.push(maxIdx);
		}

		// CTC decoding: remove blanks (0) and consecutive duplicates
		const decoded: string[] = [];
		let prevIdx = -1;

		for (const idx of predictions) {
			if (idx !== 0 && idx !== prevIdx) {
				// Map index to character (1-indexed)
				if (idx - 1 < this.charset.length) {
					decoded.push(this.charset[idx - 1]);
				}
			}
			prevIdx = idx;
		}

		return decoded.join('');
	}

	/**
	 * Perform OCR on an image.
	 * @param imageBytes Raw image bytes (JPG, PNG, WebP)
	 * @returns Recognized text
	 */
	async recognize(imageBytes: Uint8Array): Promise<string> {
		if (!this.session) {
			throw new Error('Model not initialized. Call initialize() first.');
		}

		console.time('OCR Recognition');

		try {
			// Preprocess image (async)
			const inputData = await this.preprocessImage(imageBytes);
			const inputTensor = new ort.Tensor('float32', inputData, [
				1,
				1,
				this.TARGET_HEIGHT,
				this.TARGET_WIDTH
			]);

			// Run inference
			const feeds = { input: inputTensor };
			const results = await this.session.run(feeds);

			// Get output tensor
			const output = results[Object.keys(results)[0]];
			const outputData = output.data as Float32Array;
			const outputShape = output.dims as number[];

			// Decode predictions
			const text = this.decodePredictions(outputData, outputShape);

			console.timeEnd('OCR Recognition');
			return text;
		} catch (error) {
			console.error('OCR recognition failed:', error);
			throw error;
		}
	}

	/**
	 * Release resources.
	 */
	async dispose(): Promise<void> {
		if (this.session) {
			await this.session.release();
			this.session = null;
		}
	}
}
