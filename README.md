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

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## License

MIT
