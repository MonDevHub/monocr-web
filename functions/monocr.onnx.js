export async function onRequest(context) {
	// Pinned to a model v2 revision, not `main` (which serves v3.5 since
	// 2026-08-15). A moving branch also broke the `immutable` header below.
	// Keep in step with src/lib/config.ts.
	const MODEL_URL = 'https://huggingface.co/janakhpon/monocr/resolve/a51be11/onnx/monocr.onnx';

	try {
		// Fetch with redirect following (default behavior)
		const response = await fetch(MODEL_URL, {
			headers: {
				'User-Agent': 'MonOCR-Web-Proxy'
			},
			redirect: 'follow' // Explicitly follow redirects
		});

		if (!response.ok) {
			return new Response(`Failed to fetch model: ${response.status} ${response.statusText}`, {
				status: 502,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		// Stream the response body directly (don't buffer the ~26 MB v2 model)
		return new Response(response.body, {
			status: 200,
			headers: {
				'Content-Type': 'application/octet-stream',
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=31536000, immutable',
				'Content-Length': response.headers.get('Content-Length') || ''
			}
		});
	} catch (error) {
		return new Response(`Proxy error: ${error.message}`, {
			status: 500,
			headers: { 'Content-Type': 'text/plain' }
		});
	}
}
