export async function onRequest(context) {
  const MODEL_URL = "https://huggingface.co/janakhpon/monocr/resolve/main/onnx/monocr.onnx";

  // Forward the request to Hugging Face
  const response = await fetch(MODEL_URL, {
    headers: {
      "User-Agent": "MonOCR-Web-Proxy"
    }
  });

  // Create a new response with CORS headers (just in case) and cache headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable"); // Cache for 1 year

  return newResponse;
}
