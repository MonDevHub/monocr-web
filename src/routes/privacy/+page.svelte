<script lang="ts">
</script>

<svelte:head>
	<title>Privacy Policy - MonOCR</title>
	<meta name="description" content="MonOCR Privacy Policy - Zero Data Collection" />
</svelte:head>

<div class="text-fg-primary mx-auto max-w-3xl px-6 py-12">
	<h1 class="mb-6 font-bold text-[var(--text-title)]">Privacy Policy</h1>
	<p class="text-fg-muted mb-8 text-[var(--text-meta)]">Effective Date: March 21, 2026</p>

	<div class="space-y-6">
		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">1. Zero Data Collection Promise</h2>
			<p class="text-[var(--text-body)]">
				MonOCR is built from the ground up for absolute privacy. Our edge-AI architecture ensures
				that <strong
					>100% of optical character recognition (OCR) processing occurs entirely on your device</strong
				>.
			</p>
			<p class="mt-2 text-[var(--text-body)]">
				We do not use loud telemetry, we do not require an account, and we do not transmit your
				photos or documents to any external server.
			</p>
		</section>

		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">2. Processing of Images</h2>
			<p class="text-[var(--text-body)]">
				Any images you select from your library or capture via your camera are loaded straight into
				the Neural Processing Unit (NPU/CPU) on your local hardware. The original image and the
				generated text extraction both remain isolated in your device's memory.
			</p>
		</section>

		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">
				3. Voluntary Feedback and Contributions
			</h2>
			<p class="text-[var(--text-body)]">
				If you choose to use the "Feedback" or "Contribute" features within our mobile applications,
				that data is saved locally to an offline database (using SwiftData or Room) on your device.
				It is not transmitted anywhere unless you manually choose to export and share those logs or
				screenshots with our engineering team.
			</p>
		</section>

		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">4. Diagnostic Data</h2>
			<p class="text-[var(--text-body)]">
				To maintain our strict privacy compliance, we do not use third-party cloud crash reporters.
				Diagnostic logs are written to your local file system on a rolling basis. You are in full
				control of these logs and can export them voluntarily if you encounter bugs.
			</p>
		</section>

		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">5. Changes to This Policy</h2>
			<p class="text-[var(--text-body)]">
				Because we do not collect data, we do not anticipate needing to update this policy often. If
				fundamental changes to the application architecture occur, we will reflect those in our open
				source repositories and in-app documentation.
			</p>
		</section>

		<section>
			<h2 class="mb-3 font-semibold text-[var(--text-section)]">6. Contact Us</h2>
			<p class="text-[var(--text-body)]">
				If you have any questions about this privacy statement, please contact the MonDevHub
				engineering team via our public open source repositories on GitHub.
			</p>
		</section>
	</div>
</div>
