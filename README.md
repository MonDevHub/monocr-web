A privacy-focused, in-browser OCR tool for the Mon language (mnw), built with Rust and WebAssembly.

> [!NOTE]
> This project follows the [Product Quality Constitution](.agents/workflows/constitution.md) for clarity and calmness.

## Overview

MonOCR Web brings optical character recognition for the Mon script directly to the browser. By leveraging ONNX Runtime Web and a custom Wasm backend, it performs all processing locally on the user's device. This ensures zero data latency and complete privacy—no images are ever sent to a server.

## Features

- **Local Processing**: Runs entirely in the browser using WebAssembly.
- **Privacy First**: No data collection by default; all OCR processing is 100% local.
- **Optional Cloud Sync**: Secure, opt-in synchronization for users who wish to contribute their corrected scans to the Mon language dataset.
- **High Performance**: Optimized MobileNetV3 + BiLSTM OCR engine via ONNX Runtime (~6.6M parameters).
- **Large File Support**: Supports PDFs and images up to 50MB.
- **Mon Language Support**: Specialized for recognizing Mon script.
- **Premium UX**: High-fidelity skeleton loaders and synchronized design system (16px radii, 24px spacing).

## Ecosystem

MonOCR is a cross-platform ecosystem designed for parity and performance:

- **[MonOCR Web](https://ocr.mondevhub.com)**: (This Repository) Privacy-first in-browser OCR.
- **[MonOCR Android](https://github.com/janakhpon/monocr-android)**: Native Jetpack Compose app with Material 3.
- **[MonOCR iOS](https://github.com/janakhpon/monocr-ios)**: Native SwiftUI app with SwiftData persistence.

## Quality Standards

This project is certified **Production Ready** and strictly adheres to:

- [x] Product Quality Constitution: Compact, Calm, Modern.
- [x] Privacy-First Engineering: 100% on-device processing.
- [x] Design System Convergence: Identical corner radii, spacing, and typography across all screens.
- [x] Real-World Feedback: Integrated unified feedback bridges for model improvement.
- [x] Compliance: Designed for GDPR and CCPA alignment with transparent opt-in data contribution.

## Resources

### Models & Data

- [Hugging Face Models](https://huggingface.co/Janakh/monocr) (CKPT, ONNX, ML, RTen)

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

### 4. Cloud Sync Configuration (Optional)

To enable the dataset contribution feature, you must configure the following Cloudflare Environment Variables:

- `R2_ACCESS_KEY_ID`: Cloudflare R2 Access Key.
- `R2_SECRET_ACCESS_KEY`: Cloudflare R2 Secret Key.
- `R2_ACCOUNT_ID`: Your Cloudflare Account ID.
- `R2_BUCKET_NAME`: The name of your R2 bucket (default: `monocr-dataset`).

These can be set in the **Cloudflare Pages Dashboard** under `Settings > Functions > Variables`.

## License

MIT
