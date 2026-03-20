import Dexie, { type Table } from 'dexie';

export interface OCRRecord {
	id: string; // UUID
	timestamp: number;
	category: string; // 'ocr-scan', 'feedback', 'contribution'
	fileName: string;
	fileType: string;
	fileData: Blob;
	text: string;
	processingTime: number;
}

export class OCRDatabase extends Dexie {
	records!: Table<OCRRecord, string>;

	constructor() {
		super('MonOCRDatabase');
		this.version(1).stores({
			records: 'id, timestamp, fileName, category'
		});
	}
}

export const db = typeof window !== 'undefined' ? new OCRDatabase() : null;

/**
 * Saves a new OCR record to IndexedDB.
 */
export async function saveRecord(
	record: Omit<OCRRecord, 'id' | 'timestamp' | 'category'>,
	category = 'ocr-scan'
): Promise<string> {
	if (!db) throw new Error('IndexedDB not available');

	const newRecord: OCRRecord = {
		...record,
		category,
		id: crypto.randomUUID(),
		timestamp: Date.now()
	};

	await db.records.add(newRecord);
	return newRecord.id;
}

/**
 * Retrieves all OCR records for a category, sorted by timestamp descending.
 */
export async function getRecords(category = 'ocr-scan', limit = 50): Promise<OCRRecord[]> {
	if (!db) return [];
	return await db.records
		.where('category')
		.equals(category)
		.reverse()
		.sortBy('timestamp')
		.then((records) => records.slice(0, limit));
}

/**
 * Deletes a record by ID.
 */
export async function deleteRecord(id: string): Promise<void> {
	if (!db) throw new Error('IndexedDB not available');
	await db.records.delete(id);
}

/**
 * Clears all history records for a specific category.
 */
export async function clearHistory(category = 'ocr-scan'): Promise<void> {
	if (!db) throw new Error('IndexedDB not available');
	await db.records.where('category').equals(category).delete();
}
