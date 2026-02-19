import OcrWorker from './ocr.worker?worker';
import { CONFIG } from './config';

// Types
type WorkerMessageType = 'INIT' | 'RECOGNIZE';
type WorkerResponseType = 'RESULT' | 'ERROR';

interface WorkerMessage {
	id: string;
	type: WorkerMessageType;
	payload: unknown;
}

interface WorkerResponse {
	id: string;
	type: WorkerResponseType;
	payload: unknown;
}

export class OcrError extends Error {
	constructor(
		message: string,
		public code:
			| 'INIT_FAILED'
			| 'MODEL_LOAD_FAILED'
			| 'RECOGNITION_FAILED'
			| 'TIMEOUT'
			| 'Worker_ERROR'
			| 'RECOGNIZE_FAILED',
		public originalError?: unknown
	) {
		super(message);
		this.name = 'OcrError';
	}
}

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;

// Map to store pending request resolvers
const pending = new Map<
	string,
	{ resolve: (val: unknown) => void; reject: (err: Error) => void }
>();

function getWorker(): Worker {
	if (!worker) {
		worker = new OcrWorker();
		worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
			const { id, type, payload } = e.data;
			if (pending.has(id)) {
				const { resolve, reject } = pending.get(id)!;
				pending.delete(id);
				if (type === 'ERROR') {
					reject(new OcrError(payload as string, 'Worker_ERROR'));
				} else {
					resolve(payload);
				}
			}
		};
		worker.onerror = (e) => {
			console.error('Worker error:', e);
			// We might want to reject all pending promises
			for (const { reject } of pending.values()) {
				reject(new OcrError('Worker terminated unexpectedly', 'Worker_ERROR'));
			}
			pending.clear();
			worker = null;
			initPromise = null;
		};
	}
	return worker;
}

export function cleanup(): void {
	if (worker) {
		worker.terminate();
		worker = null;
	}
	initPromise = null;
	// Reject all pending
	for (const { reject } of pending.values()) {
		reject(new OcrError('Cleanup called', 'Worker_ERROR'));
	}
	pending.clear();
}

// Add cleanup on unload
if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', () => cleanup());
}

// Update request signature to accept transferables
function request<T>(
	type: WorkerMessageType,
	payload: unknown,
	transferables: Transferable[] = [],
	timeoutMs = CONFIG.WORKER.TIMEOUT_MS
): Promise<T> {
	const id = crypto.randomUUID();
	const w = getWorker();

	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => {
			if (pending.has(id)) {
				pending.delete(id);
				reject(new OcrError('Request timed out', 'TIMEOUT'));
			}
		}, timeoutMs);

		pending.set(id, {
			resolve: (val) => {
				clearTimeout(timer);
				resolve(val as T);
			},
			reject: (err) => {
				clearTimeout(timer);
				reject(err);
			}
		});

		const msg: WorkerMessage = { id, type, payload };
		w.postMessage(msg, transferables);
	});
}

export async function initializeEngine(): Promise<void> {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		console.log('Initializing ONNX Runtime Worker...');
		try {
			// Pass model paths to worker (worker will fetch them)
			await request('INIT', {
				modelPath: CONFIG.MODELS.RECOGNITION,
				charsetPath: CONFIG.MODELS.CHARSET
			});
			console.log('Worker initialized.');
		} catch (e: unknown) {
			initPromise = null; // Allow retry
			const error =
				e instanceof OcrError ? e : new OcrError(`Initialization failed: ${e}`, 'INIT_FAILED', e);
			throw error;
		}
	})();

	return initPromise;
}

export async function recognize(imageBytes: Uint8Array): Promise<string> {
	try {
		await initializeEngine();
		return await request<string>('RECOGNIZE', imageBytes);
	} catch (e: unknown) {
		const error =
			e instanceof OcrError ? e : new OcrError(`Recognition failed: ${e}`, 'RECOGNIZE_FAILED', e);
		throw error;
	}
}
