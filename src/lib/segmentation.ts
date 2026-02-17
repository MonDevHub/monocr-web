/**
 * Simple Horizontal Projection Profile segmentation for finding text lines.
 * 
 * Algorithm:
 * 1. Convert to grayscale
 * 2. Calculate row density (sum of dark pixels per row)
 * 3. Find valleys (whitespace) to split lines
 */

export interface LineSegment {
    y: number;
    height: number;
    // We optionally could look for x-bounds too, but usually full width is fine for CRNN
}

export function segmentLines(
    imageData: ImageData, 
    threshold: number = 128, 
    minLineHeight: number = 10,
    minGap: number = 5
): LineSegment[] {
    const { width, height, data } = imageData;
    const rowDensity = new Int32Array(height);

    // 1. Calculate Horizontal Projection Profile
    // We want to count *dark* pixels (text)
    for (let y = 0; y < height; y++) {
        let darkPixels = 0;
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const a = data[offset + 3];

            if (a < 50) continue; // Transparent

            // Grayscale
            const gray = (r + g + b) / 3;
            
            // If dark enough, count it
            if (gray < threshold) {
                darkPixels++;
            }
        }
        rowDensity[y] = darkPixels;
    }

    // 2. Find connected components in the profile
    const segments: LineSegment[] = [];
    let inLine = false;
    let startY = 0;

    // Use a small noise floor - sometimes paper grain causes noise
    const noiseFloor = width * 0.01; // 1% of width

    for (let y = 0; y < height; y++) {
        const isTextRow = rowDensity[y] > noiseFloor;

        if (isTextRow && !inLine) {
            inLine = true;
            startY = y;
        } else if (!isTextRow && inLine) {
            // End of line
            const h = y - startY;
            if (h >= minLineHeight) {
                segments.push({ y: startY, height: h });
            }
            inLine = false;
        }
    }

    // Catch last line if image ends with text
    if (inLine) {
        const h = height - startY;
        if (h >= minLineHeight) {
            segments.push({ y: startY, height: h });
        }
    }

    // 3. Merge close segments (optional, simpler to just return raw segments first)
    // If lines are closer than minGap, merge them? 
    // For now, let's keep them separate as the model probably prefers single lines.
    
    // However, sometimes diacritics in Mon styling might cause a tiny gap.
    // Let's do a simple merge pass:
    if (segments.length > 1) {
        const merged: LineSegment[] = [];
        let current = segments[0];

        for (let i = 1; i < segments.length; i++) {
            const next = segments[i];
            const gap = next.y - (current.y + current.height);
            
            if (gap < minGap) {
                // Merge
                current.height = (next.y + next.height) - current.y;
            } else {
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);
        return merged;
    }

    return segments;
}
