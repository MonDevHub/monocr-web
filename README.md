# MonOCR Web

A privacy-focused, in-browser OCR tool for the Mon language (mnw), built with Rust and WebAssembly.

## Overview

MonOCR Web brings optical character recognition for the Mon script directly to the browser. By leveraging ONNX Runtime Web and a custom Wasm backend, it performs all processing locally on the user's device. This ensures zero data latency and complete privacy—no images are ever sent to a server.

## Features

- **Local Processing**: Runs entirely in the browser using WebAssembly.
- **Privacy First**: No data collection or server-side processing.
- **High Performance**: Optimized CRNN models via ONNX Runtime.
- **Mon Language Support**: Specialized for recognizing Mon script.

## Resources

### Models & Data

- [Hugging Face Models](https://huggingface.co/Janakh/monocr) (CKPT, ONNX, TFLite, RTen)

### SDKs & Packages

- [Unified SDKs](https://github.com/janakhpon/monocr-onnx)
- [NPM Package](https://www.npmjs.com/package/monocr)
- [PyPI - Raw](https://pypi.org/project/monocr/)
- [PyPI - ONNX](https://pypi.org/project/monocr-onnx/)
- [Go Package](github.com/MonDevHub/monocr-onnx/go)
- [Tokenizer](https://github.com/Code-Yay-Mal/mon_tokenizer)

## Development

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Prepare Local Assets (WASM)

To run locally, we need to copy the pre-built ONNX Runtime WASM files from `node_modules` to `static/wasm/`.

```bash
pnpm run copy-wasm
```

### 3. Start Dev Server

```bash
pnpm dev
# Note: This automatically runs copy-wasm before starting
```

## Building for Production

To create a production build (static site):

```bash
pnpm build
```

**Note**: The build script automatically removes the large `monocr.onnx` model from the output to comply with Cloudflare's 25MB asset limit. In production, the model is fetched directly from Hugging Face.

## Deployment (Cloudflare Pages)

This project is optimized for **Cloudflare Pages**.

1.  **Build Command**: `pnpm build`
2.  **Output Directory**: `build`
3.  **WASM Assets**: Included automatically via `static/wasm/` (ensure these are committed to git).
4.  **Model**: Served from Hugging Face (configured in `src/lib/config.ts`).

### Manual Deploy (Wrangler)

If you have `wrangler` installed/configured:

```bash
npx wrangler deploy
```

(This uses the `wrangler.json` configuration to deploy the `build` folder).

## License

MIT
