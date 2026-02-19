/**
 * Robust Horizontal Projection Profile segmentation for finding text lines.
 *
 * Algorithm:
 * 1. Convert to grayscale
 * 2. Adaptive Binarization (handling shadows/uneven lighting)
 * 3. Calculate row density (sum of text pixels per row)
 * 4. Smooth profile
 * 5. Find valleys (whitespace) to split lines with generous padding
 */

export interface LineSegment {
	y: number;
	height: number;
	// Bounding box relative to image
}

export function segmentLines(
	imageData: ImageData,
	// minLineHeight unused in this robust algo, kept for API compat if needed but removing to fix lint

	smoothKernel: number = 5
): LineSegment[] {
	const { width, height, data } = imageData;
	const grayData = new Uint8Array(width * height);

	// 1. Convert to Grayscale
	for (let i = 0; i < width * height; i++) {
		const offset = i * 4;
		const r = data[offset];
		const g = data[offset + 1];
		const b = data[offset + 2];
		// Standard luma conversion
		grayData[i] = 0.299 * r + 0.587 * g + 0.114 * b;
	}

	// 2. Adaptive Thresholding (Integral Image approach for speed)
	// We want binary: 1 for text (dark), 0 for background (light)
	// Simple block mean thresholding
	const binaryData = new Uint8Array(width * height);
	const windowSize = 25;
	const C = 10;

	// Integral Image for fast local mean
	const integral = new Uint32Array(width * height);

	// Compute Integral Image
	for (let y = 0; y < height; y++) {
		let sum = 0;
		for (let x = 0; x < width; x++) {
			sum += grayData[y * width + x];
			if (y === 0) {
				integral[y * width + x] = sum;
			} else {
				integral[y * width + x] = integral[(y - 1) * width + x] + sum;
			}
		}
	}

	function getSum(x1: number, y1: number, x2: number, y2: number): number {
		const a = x1 > 0 && y1 > 0 ? integral[(y1 - 1) * width + (x1 - 1)] : 0;
		const b = y1 > 0 ? integral[(y1 - 1) * width + x2] : 0;
		const c = x1 > 0 ? integral[y2 * width + (x1 - 1)] : 0;
		const d = integral[y2 * width + x2];
		return d - b - c + a;
	}

	const halfWin = Math.floor(windowSize / 2);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const x1 = Math.max(0, x - halfWin);
			const y1 = Math.max(0, y - halfWin);
			const x2 = Math.min(width - 1, x + halfWin);
			const y2 = Math.min(height - 1, y + halfWin);

			const count = (x2 - x1 + 1) * (y2 - y1 + 1);
			const sum = getSum(x1, y1, x2, y2);
			const mean = sum / count;

			// If pixel is darker than local mean - C, it is text
			// Text is black (low value), background white (high value)
			if (grayData[y * width + x] < mean - C) {
				binaryData[y * width + x] = 1;
			} else {
				binaryData[y * width + x] = 0;
			}
		}
	}

	// 3. Horizontal Projection Profile
	const rawHist = new Float32Array(height);
	for (let y = 0; y < height; y++) {
		let sum = 0;
		for (let x = 0; x < width; x++) {
			sum += binaryData[y * width + x];
		}
		rawHist[y] = sum;
	}

	// 4. Smooth Histogram (Box filter)
	const hist = new Float32Array(height);
	if (smoothKernel > 1) {
		const halfK = Math.floor(smoothKernel / 2);
		for (let y = 0; y < height; y++) {
			let sum = 0;
			let count = 0;
			for (let k = -halfK; k <= halfK; k++) {
				const ky = y + k;
				if (ky >= 0 && ky < height) {
					sum += rawHist[ky];
					count++;
				}
			}
			hist[y] = sum / count;
		}
	} else {
		hist.set(rawHist);
	}

	// 5. Find Valleys
	// Max density
	let maxVal = 0;
	for (let i = 0; i < height; i++) {
		if (hist[i] > maxVal) maxVal = hist[i];
	}

	const threshold = maxVal * 0.02; // 2% threshold ratio

	const segments: LineSegment[] = [];
	let startY: number | null = null;

	for (let y = 0; y < height; y++) {
		const isText = hist[y] > threshold;

		if (isText && startY === null) {
			startY = y;
		} else if (!isText && startY !== null) {
			const endY = y;

			if (endY - startY > 8) {
				// Generous Padding
				const pad = 4;
				const y1 = Math.max(0, startY - pad);
				const y2 = Math.min(height, endY + pad);

				segments.push({ y: y1, height: y2 - y1 });
			}
			startY = null;
		}
	}

	// Last segment
	if (startY !== null) {
		if (height - startY > 8) {
			const pad = 4;
			const y1 = Math.max(0, startY - pad);
			const y2 = Math.min(height, height);
			segments.push({ y: y1, height: y2 - y1 });
		}
	}

	return segments;
}
