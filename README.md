> [!IMPORTANT]
> **Superseded.** This repository is the earlier (v2) MonOCR web app, kept for history. The web app now
> lives in [MonDevHub/monocr](https://github.com/MonDevHub/monocr) (`apps/web`), and the live site is
> [ocr.mondevhub.com](https://ocr.mondevhub.com). The model figures below describe the v2 model, not the
> current one.

A privacy-first, in-browser OCR engine for the [Mon language](https://en.wikipedia.org/wiki/Mon_language) (mnw), powered by Rust, WebAssembly, and ONNX Runtime.

> [!NOTE]
> The [Mon language](https://en.wikipedia.org/wiki/Mon_language) is classified as a "vulnerable" language in [UNESCO's Atlas of the World’s Languages in Danger](https://en.wikipedia.org/wiki/Atlas_of_the_World%27s_Languages_in_Danger).
>
> This project aims to digitize the Mon script, establishing a digital foundation suitable for future development, system integrations, and AI-driven preservation efforts.

## Overview

MonOCR Web brings optical character recognition for the Mon script directly to the browser. By leveraging **ONNX Runtime Web** and a custom **Wasm** backend, all processing is performed locally on the user's device. Images are not sent to a server for recognition, and once the model is cached the app works offline. Files leave the browser only if the user opts in to Cloud Sync.

## Key Features

- **On-Device Inference**: Runs entirely in the browser via WebAssembly (Wasm).
- **Local by Default**: OCR runs on the device. Nothing is uploaded unless the user turns on Cloud Sync.
- **Optional Cloud Sync**: Secure, opt-in synchronization for contributing corrected scans to the open-source Mon language dataset.
- **Model (v2, historical)**: MobileNetV3 + BiLSTM OCR engine (~6.6M parameters).
- **Format Support**: Handles PDFs and images up to 50MB.
- **Script Specialized**: Purpose-built for Mon script recognition, with supplementary support for Burmese and English.

> [!TIP]
> File size is limited to 50MB for web and 20MB for mobile. For processing larger files or leveraging more powerful hardware, please use the CLI or package directly via `uv add monocr` or `pip install monocr`.

## Architecture

```
Image (Canvas/Blob)
  LineSegmenter     → horizontal projection profile → List<LineSegment>
  ImagePreprocessor  → grayscale + normalize [-1.0, 1.0]
  MonOcrEngine      → ONNX Runtime Web (monocr.onnx)
  CtcDecoder        → greedy CTC decode → String
```

### Model Specification (v2, historical)

This table describes the v2 model this repository ships, pinned to Hugging Face revision
[`a51be11`](https://huggingface.co/janakhpon/monocr/tree/a51be11) (`src/lib/config.ts`). For the current
model (v3.5, 11.55M parameters), see the [MonOCR model card](https://huggingface.co/janakhpon/monocr).

| Attribute    | Specification                  |
| ------------ | ------------------------------ |
| Architecture | MobileNetV3 + BiLSTM-384 + CTC |
| Precision    | FP32 (ONNX)                    |
| Parameters   | ~6.6M                          |
| Input        | 128 × Variable (H × W)         |
| Asset Size   | ~25 MB                         |

## Project Structure

```
monocr-web/
├── src/
│   ├── lib/
│   │   ├── monocr-onnx.ts    # OCR Pipeline (ONNX/Wasm)
│   │   ├── components/       # Svelte UI Components
│   │   └── utils/            # Image & PDF Processing
│   └── routes/               # Application Pages
├── ocr-engine/               # Rust/Wasm engine (rten + ocrs)
├── functions/                # Cloudflare Pages model proxy
├── static/
│   ├── wasm/                 # ONNX Runtime Wasm Binaries
│   └── fonts/                # Mon/Myanmar Unicode Fonts
└── scripts/                  # Build & Asset Management
```

## Ecosystem

The web, Android and iOS apps now live together in [MonDevHub/monocr](https://github.com/MonDevHub/monocr):

- **Web**: live at [ocr.mondevhub.com](https://ocr.mondevhub.com), built from `apps/web` (this repository is its predecessor).
- **Android**: native Jetpack Compose app in `apps/android`. It is not in Google Play yet, so build it from source.
- **iOS**: native SwiftUI app in `apps/ios`. It is not in the App Store yet, so build it from source.

## Development

### Prerequisites

- **Node.js** 24+
- **pnpm** 11+

### 1. Setup

```bash
pnpm install
```

### 2. Prepare Assets

Copy the pre-built ONNX Runtime WASM files to the static directory:

```bash
pnpm run copy-wasm
```

### 3. Local Development

```bash
pnpm dev
```

### 4. Production Build

```bash
pnpm build
```

> [!IMPORTANT]
> The build script automatically optimizes the `monocr.onnx` model deployment to comply with edge asset limits. In production, models are fetched from the HuggingFace CDN.

## Resources

- [HuggingFace Models](https://huggingface.co/janakhpon/monocr) (ONNX, Core ML)
- [Unified SDKs](https://github.com/janakhpon/monocr-onnx)
- [NPM Package](https://www.npmjs.com/package/monocr)
- [Help contribute to copy/translations here](https://docs.google.com/spreadsheets/d/1sr8WtiMEyDuDd1amI-wzAz5d2acZlVC7zOZMqixOADQ/edit?usp=sharing)

## License

MIT
