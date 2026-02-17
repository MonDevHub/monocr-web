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
	 * - Convert to grayscale
	 * - Resize to 64px height (maintaining aspect ratio)
	 * - Pad to 1024px width
	 * - Normalize to [-1, 1]
	 */
	private async preprocessImage(imageData: Uint8Array): Promise<Float32Array> {
		// Decode image using createImageBitmap (async, efficient)
		const blob = new Blob([imageData as any]);
		const imageBitmap = await createImageBitmap(blob);

		// Draw to canvas to get pixel data
		const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
		const ctx = canvas.getContext('2d')!;
		ctx.drawImage(imageBitmap, 0, 0);
		const imageDataObj = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);

		const { width, height } = imageDataObj;
		const pixelData = imageDataObj.data;

		// Convert to grayscale
		const grayData = new Uint8Array(width * height);
		for (let i = 0; i < width * height; i++) {
			const offset = i * 4;
			// Standard RGB to grayscale conversion
			grayData[i] = Math.round(
				0.299 * pixelData[offset] + 0.587 * pixelData[offset + 1] + 0.114 * pixelData[offset + 2]
			);
		}

		// Resize to target height, maintaining aspect ratio
		const scale = this.TARGET_HEIGHT / height;
		const newWidth = Math.min(Math.round(width * scale), this.TARGET_WIDTH);
		const resized = this.resizeBilinear(grayData, width, height, newWidth, this.TARGET_HEIGHT);

		// Pad to TARGET_WIDTH with white (255)
		const paddedCanvas = new Float32Array(this.TARGET_HEIGHT * this.TARGET_WIDTH);
		paddedCanvas.fill(255); // White background

		for (let y = 0; y < this.TARGET_HEIGHT; y++) {
			for (let x = 0; x < newWidth; x++) {
				paddedCanvas[y * this.TARGET_WIDTH + x] = resized[y * newWidth + x];
			}
		}

		// Normalize to [-1, 1]
		for (let i = 0; i < paddedCanvas.length; i++) {
			paddedCanvas[i] = paddedCanvas[i] / 127.5 - 1.0;
		}

		imageBitmap.close();
		return paddedCanvas;
	}

	/**
	 * Bilinear resize algorithm.
	 */
	private resizeBilinear(
		src: Uint8Array,
		srcWidth: number,
		srcHeight: number,
		dstWidth: number,
		dstHeight: number
	): Uint8Array {
		const dst = new Uint8Array(dstWidth * dstHeight);
		const xRatio = srcWidth / dstWidth;
		const yRatio = srcHeight / dstHeight;

		for (let y = 0; y < dstHeight; y++) {
			for (let x = 0; x < dstWidth; x++) {
				const srcX = x * xRatio;
				const srcY = y * yRatio;
				const x1 = Math.floor(srcX);
				const y1 = Math.floor(srcY);
				const x2 = Math.min(x1 + 1, srcWidth - 1);
				const y2 = Math.min(y1 + 1, srcHeight - 1);

				const dx = srcX - x1;
				const dy = srcY - y1;

				const p1 = src[y1 * srcWidth + x1];
				const p2 = src[y1 * srcWidth + x2];
				const p3 = src[y2 * srcWidth + x1];
				const p4 = src[y2 * srcWidth + x2];

				const val =
					p1 * (1 - dx) * (1 - dy) + p2 * dx * (1 - dy) + p3 * (1 - dx) * dy + p4 * dx * dy;

				dst[y * dstWidth + x] = Math.round(val);
			}
		}

		return dst;
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
