export const CONFIG = {
	MODELS: {
		// Model v2 at a pinned revision. `main` now serves v3.5 (160px input, 277
		// classes), which does not match this app's 128px input or charset.txt.
		// Keep in step with functions/monocr.onnx.js.
		RECOGNITION: 'https://huggingface.co/janakhpon/monocr/resolve/a51be11/onnx/monocr.onnx',
		CHARSET: '/charset.txt'
	},
	WORKER: {
		TIMEOUT_MS: 60000,
		MAX_RETRIES: 3
	},
	UI: {
		MAX_IMAGE_SIZE_MB: 50,
		ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
	},
	SYNC: {
		MAX_RETRIES: 3,
		BATCH_DELAY_MS: 1000,
		ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
	}
} as const;

export type Config = typeof CONFIG;
