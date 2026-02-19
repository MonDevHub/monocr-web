import * as ort from 'onnxruntime-web';

import { segmentLines } from './segmentation';

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
			// Load charset with caching
			const charsetBuffer = await this.fetchAsset(charsetPath);
			const decoder = new TextDecoder('utf-8');
			this.charset = decoder.decode(charsetBuffer).trim();

			// Load ONNX model with Caching strategy
			const modelBuffer = await this.fetchAsset(modelPath);

			// Init session with buffer
			this.session = await ort.InferenceSession.create(modelBuffer, sessionOptions);

			// Warm-up inference to JIT-compile kernels
			await this.warmup();
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Fetch asset with caching (Cache API) for performance and robustness.
	 */
	private async fetchAsset(url: string): Promise<Uint8Array> {
		const CACHE_NAME = 'monocr-models-v1';
		try {
			// Check browser cache first
			if ('caches' in self) {
				const cache = await caches.open(CACHE_NAME);
				const cachedResponse = await cache.match(url);

				if (cachedResponse) {
					const buffer = await cachedResponse.arrayBuffer();
					return new Uint8Array(buffer);
				}

				const response = await fetch(url);
				if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);

				// Clone response to put in cache
				cache.put(url, response.clone());

				const buffer = await response.arrayBuffer();
				return new Uint8Array(buffer);
			}
		} catch (e) {
			// Squelch cache errors
		}

		// Fallback: Direct fetch (no cache or cache error)
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
		return new Uint8Array(await response.arrayBuffer());
	}

	/**
	 * Warm-up the model with a dummy input to trigger JIT compilation.
	 */
	private async warmup(): Promise<void> {
		const dummyData = new Float32Array(1 * 1 * this.TARGET_HEIGHT * this.TARGET_WIDTH).fill(0);
		const dummyTensor = new ort.Tensor('float32', dummyData, [
			1,
			1,
			this.TARGET_HEIGHT,
			this.TARGET_WIDTH
		]);
		await this.session!.run({ input: dummyTensor });
	}

	/**
	 * Process a single text line into model input tensor format.
	 */
	private async processLine(source: ImageBitmap, sy: number, sh: number): Promise<Float32Array> {
		const sw = source.width;

		// Calculate scaled dimensions
		const scale = this.TARGET_HEIGHT / sh;
		const scaledWidth = Math.min(Math.round(sw * scale), this.TARGET_WIDTH);

		// Use OffscreenCanvas
		const canvas = new OffscreenCanvas(this.TARGET_WIDTH, this.TARGET_HEIGHT);
		const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

		// Fill with white background
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, this.TARGET_WIDTH, this.TARGET_HEIGHT);

		// Draw cropped and scaled image
		// drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
		ctx.drawImage(source, 0, sy, sw, sh, 0, 0, scaledWidth, this.TARGET_HEIGHT);

		const { data } = ctx.getImageData(0, 0, this.TARGET_WIDTH, this.TARGET_HEIGHT);

		// Convert to grayscale and normalize
		const float32Data = new Float32Array(this.TARGET_WIDTH * this.TARGET_HEIGHT);
		for (let i = 0; i < float32Data.length; i++) {
			const offset = i * 4;
			const r = data[offset];
			const g = data[offset + 1];
			const b = data[offset + 2];
			const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
			float32Data[i] = gray / 127.5 - 1.0;
		}

		return float32Data;
	}

	/**
	 * Decode CTC predictions using greedy decoding.
	 */
	private decodePredictions(logits: Float32Array, shape: number[]): string {
		const [, timeSteps, numClasses] = shape;

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

		
		try {
			// 1. Decode generic image to Bitmap
			const blob = new Blob([imageBytes as unknown as BlobPart]);
			const fullBitmap = await createImageBitmap(blob);

			// 2. Get pixel data for segmentation
			// We MUST use a canvas to get ImageData (pixels)
			const segCanvas = new OffscreenCanvas(fullBitmap.width, fullBitmap.height);
			const segCtx = segCanvas.getContext('2d', { willReadFrequently: true })!;
			segCtx.drawImage(fullBitmap, 0, 0);
			const imageData = segCtx.getImageData(0, 0, fullBitmap.width, fullBitmap.height);

			// 3. Segment Lines
			let segments = segmentLines(imageData);

			// Fallback: if no segments found (e.g. single large word filling bounds?), use full image
			if (segments.length === 0) {
				segments = [{ y: 0, height: fullBitmap.height }];
			}

			const results: string[] = [];

			// 4. Process each line
			for (const seg of segments) {
				const inputData = await this.processLine(fullBitmap, seg.y, seg.height);
				const inputTensor = new ort.Tensor('float32', inputData, [
					1,
					1,
					this.TARGET_HEIGHT,
					this.TARGET_WIDTH
				]);

				const feeds = { input: inputTensor };
				const inferResults = await this.session.run(feeds);
				const output = inferResults[Object.keys(inferResults)[0]];
				const text = this.decodePredictions(output.data as Float32Array, output.dims as number[]);

				if (text.trim()) {
					results.push(text);
				}
			}

			fullBitmap.close();
			return results.join('\n');
		} catch (error) {
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
