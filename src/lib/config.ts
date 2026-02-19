export const CONFIG = {
	MODELS: {
		RECOGNITION: 'https://huggingface.co/janakhpon/monocr/resolve/main/onnx/monocr.onnx',
		CHARSET: '/charset.txt'
	},
	WORKER: {
		TIMEOUT_MS: 60000,
		MAX_RETRIES: 3
	},
	UI: {
		MAX_IMAGE_SIZE_MB: 10,
		ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
	}
} as const;

export type Config = typeof CONFIG;
