<main id="main-content" class="mx-auto max-w-3xl space-y-8 px-6 py-12">
	<h1 class="text-fg-primary text-3xl font-semibold tracking-tight">About MonOCR</h1>

	<div class="text-fg-secondary space-y-6 text-base leading-relaxed">
		<p>
			The Mon language (mnw) is my native language. Today, its use is slowly declining and UNESCO
			classifies it as vulnerable.
		</p>

		<p>
			One of the biggest challenges is that Mon has very little digital presence. There are almost
			no public datasets, which makes it difficult to build modern tools like search systems,
			language models, or AI applications. Most of our written knowledge still lives in scanned
			books and old documents.
		</p>

		<p>
			As part of a long-term effort to help bring Mon into the digital world, I built a modern OCR
			engine to recognize the Mon script. The current model features a ~6.6M parameter architecture
			based on MobileNetV3 + BiLSTM + CTC beam search, designed to reliably extract text lines from
			scanned materials even with complex degradation or noise. This engine uses ONNX Runtime Web
			with dynamic range quantization, leveraging WebGPU and WASM SIMD to run inference entirely
			locally in your browser—ensuring complete privacy and fast performance processing ~1.18M lines
			of training corpus seamlessly.
		</p>

		<p>
			This is just one small step, but I hope MonOCR can help turn our printed history into digital
			text — and open the door for future tools, research, datasets, and AI integrations.
		</p>
	</div>
</main>
