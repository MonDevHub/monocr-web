/**
 * Debug utilities for visualizing line segmentation
 */
import { segmentLines, type LineSegment } from './segmentation';

export function visualizeSegments(
    imageData: ImageData,
    segments: LineSegment[]
): ImageData {
    // Clone the image data
    const debugData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );

    // Draw red lines at segment boundaries
    for (const seg of segments) {
        const startY = seg.y;
        const endY = seg.y + seg.height;

        // Draw start line (green)
        for (let x = 0; x < debugData.width; x++) {
            const offset = (startY * debugData.width + x) * 4;
            debugData.data[offset] = 0;     // R
            debugData.data[offset + 1] = 255; // G
            debugData.data[offset + 2] = 0;   // B
            debugData.data[offset + 3] = 255; // A
        }

        // Draw end line (red)
        if (endY < debugData.height) {
            for (let x = 0; x < debugData.width; x++) {
                const offset = (endY * debugData.width + x) * 4;
                debugData.data[offset] = 255;   // R
                debugData.data[offset + 1] = 0;   // G
                debugData.data[offset + 2] = 0;   // B
                debugData.data[offset + 3] = 255; // A
            }
        }
    }

    return debugData;
}

export function logSegmentationDetails(
    imageData: ImageData,
    segments: LineSegment[]
): void {
    console.group('🔍 Segmentation Debug');
    console.log('Image dimensions:', imageData.width, 'x', imageData.height);
    console.log('Segments found:', segments.length);
    
    segments.forEach((seg, i) => {
        const coverage = (seg.height / imageData.height * 100).toFixed(1);
        console.log(`Line ${i + 1}: y=${seg.y}, height=${seg.height} (${coverage}% of image)`);
    });
    
    console.groupEnd();
}
