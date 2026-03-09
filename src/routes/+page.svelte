<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { initializeEngine, recognize, cleanup } from '$lib/monocr';
	import { CONFIG } from '$lib/config';

	let engineReady = false;
	let loading = false;
	let error: string | null = null;

	let file: File | null = null;
	let previewUrl: string | null = null;
	let resultText: string | null = null;
	let processingTime = 0;
	let copied = false;

	onMount(async () => {
		try {
			loading = true;
			await initializeEngine();
			engineReady = true;
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e);
			error = `Failed to load OCR engine: ${msg}`;
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		cleanup();
		if (previewUrl) URL.revokeObjectURL(previewUrl);
	});

	async function handleFile(e: CustomEvent<File>) {
		if (!engineReady) return;

		const newFile = e.detail;
		if (!newFile) return;

		// Validation
		if (newFile.size > CONFIG.UI.MAX_IMAGE_SIZE_MB * 1024 * 1024) {
			error = `File too large (Max ${CONFIG.UI.MAX_IMAGE_SIZE_MB}MB)`;
			return;
		}
		if (!(CONFIG.UI.ALLOWED_FILE_TYPES as readonly string[]).includes(newFile.type)) {
			error = 'Invalid file type. Allowed: JPG, PNG, WEBP';
			return;
		}

		file = newFile;

		// Reset
		resultText = null;
		error = null;
		if (previewUrl) {
			try {
				URL.revokeObjectURL(previewUrl);
			} catch {
				// Ignore cleanup errors
			}
		}
		previewUrl = URL.createObjectURL(file);

		processImage();
	}

	async function processImage() {
		if (!file) return;

		try {
			loading = true;
			const start = performance.now();

			const buffer = await file.arrayBuffer();
			const bytes = new Uint8Array(buffer);

			// Run OCR
			const text = await recognize(bytes);
			resultText = text;

			const end = performance.now();
			processingTime = Math.round(end - start);
		} catch (e: unknown) {
			console.error(e);
			const msg = e instanceof Error ? e.message : String(e);
			error = `OCR Failed: ${msg}`;
		} finally {
			loading = false;
		}
	}

	function reset() {
		file = null;
		if (previewUrl) {
			try {
				URL.revokeObjectURL(previewUrl);
			} catch {
				// Ignore cleanup errors
			}
		}
		previewUrl = null;
		resultText = null;
		error = null;
	}
	function downloadText() {
		if (!resultText) return;

		const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		// Create a filename from the current date/time to avoid overwrites
		const dateObj = new Date();
		const dateStr = dateObj.toISOString().split('T')[0];
		const timeStr = dateObj.toTimeString().split(' ')[0].replace(/:/g, '-');
		link.download = `monocr-extraction-${dateStr}-${timeStr}.txt`;

		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<div class="w-full">
	<!-- Header -->
	<!-- Header -->
	<header class="mb-12 space-y-6 text-center">
		<p class="text-fg-primary mx-auto mt-12 max-w-2xl text-lg leading-relaxed font-normal">
			Mon OCR that runs entirely in your browser — fast, private, and built to help bring Mon texts
			into the digital world.
		</p>
		<p class="text-fg-secondary mx-auto max-w-lg text-xs">
			<span class="font-semibold">Requirements:</span> Modern browser with Hardware Acceleration
			(GPU) and 4GB+ RAM.
			<br />
			The model (26.3MB) is downloaded once and runs <strong>entirely offline</strong>.
		</p>

		{#if !engineReady && !error}
			<div
				class="inline-flex animate-pulse items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
			>
				>
				<div
					class="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
				></div>
				Downloading Model from Hugging Face... (Please wait)
			</div>
		{:else if error}
			<div
				class="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
			>
				<div class="h-1.5 w-1.5 rounded-full bg-current"></div>
				{error}
			</div>
		{:else}
			<div
				class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
				in:fade
			>
				<div class="h-1.5 w-1.5 rounded-full bg-current"></div>
				Engine Ready (Cached for offline use)
			</div>
		{/if}
	</header>

	<!-- Main Content -->
	<main id="main-content" class="space-y-8">
		{#if !file}
			<div in:fade={{ duration: 300 }}>
				<Dropzone on:file={handleFile} />
			</div>
		{:else}
			<div class="mx-auto flex w-full max-w-2xl flex-col gap-6" in:fly={{ y: 20, duration: 400 }}>
				<!-- Image Preview -->
				<div class="flex flex-col space-y-3">
					<div
						class="border-border bg-canvas-subtle relative flex min-h-[150px] flex-1 items-center justify-center overflow-hidden rounded-xl border p-4 shadow-sm"
					>
						<img src={previewUrl} alt="Preview" class="h-auto max-h-[30vh] w-full object-contain" />
					</div>
					<button
						on:click={reset}
						class="hover:text-fg-primary hover:decoration-fg-secondary text-fg-secondary decoration-border flex min-h-[44px] items-center self-start text-sm underline underline-offset-4 transition-colors"
						aria-label="Process another image"
					>
						Process another image
					</button>
				</div>

				<!-- Result -->
				<div
					class="border-border bg-canvas flex min-h-[250px] flex-col overflow-hidden rounded-xl border shadow-sm"
				>
					<div
						class="border-border bg-canvas-subtle flex items-center justify-between border-b px-5 py-3"
					>
						<h2 class="text-fg-primary text-sm font-semibold">Extracted Text</h2>
						{#if processingTime > 0 && !loading && resultText}
							<div class="text-fg-secondary flex items-center gap-3 font-mono text-xs">
								<span
									>{resultText
										.trim()
										.split(/\s+/)
										.filter((w) => w.length > 0).length} words</span
								>
								<span class="opacity-50">•</span>
								<span>{resultText.length} chars</span>
								<span class="opacity-50">•</span>
								<span>{processingTime}ms</span>
							</div>
						{/if}
					</div>

					<div class="relative max-h-[40vh] flex-1 overflow-y-auto p-5">
						{#if loading}
							<div
								class="bg-canvas/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm"
							>
								<div class="flex flex-col items-center gap-3">
									<div
										class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
									></div>
									<span class="text-fg-secondary text-sm font-medium">Scanning...</span>
								</div>
							</div>
						{/if}

						{#if resultText}
							<div class="prose max-w-none dark:prose-invert">
								<p
									class="font-mon text-fg-primary text-base leading-relaxed break-words whitespace-pre-wrap"
								>
									{resultText}
								</p>
							</div>
						{:else if loading}
							<div class="flex flex-col gap-4 opacity-40">
								<div class="bg-border h-3 w-full animate-pulse rounded-full"></div>
								<div class="bg-border h-3 w-11/12 animate-pulse rounded-full"></div>
								<div class="bg-border h-3 w-4/5 animate-pulse rounded-full"></div>
								<div class="bg-border h-3 w-full animate-pulse rounded-full"></div>
								<div class="bg-border h-3 w-3/4 animate-pulse rounded-full"></div>
							</div>
						{:else}
							<div class="text-fg-secondary flex h-full items-center justify-center text-sm italic">
								No text extracted
							</div>
						{/if}
					</div>

					{#if resultText}
						<div class="border-border bg-canvas-subtle flex justify-end gap-2 border-t px-4 py-3">
							<button
								class="text-fg-secondary hover:text-fg-primary dark:text-fg-secondary dark:hover:text-fg-primary flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								on:click={downloadText}
								title="Save as text file"
								aria-label="Save extracted text as a file"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
									<polyline points="7 10 12 15 17 10" />
									<line x1="12" x2="12" y1="15" y2="3" />
								</svg>
							</button>
							<button
								class="text-fg-secondary hover:text-fg-primary dark:text-fg-secondary dark:hover:text-fg-primary flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								on:click={() => {
									navigator.clipboard.writeText(resultText || '');
									copied = true;
									setTimeout(() => (copied = false), 2000);
								}}
								title="Copy to clipboard"
								aria-label="Copy extracted text to clipboard"
							>
								{#if copied}
									<span
										class="text-emerald-600 dark:text-emerald-400"
										in:fly={{ y: 5, duration: 200 }}>Copied!</span
									>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										class="text-emerald-600 dark:text-emerald-400"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="M20 6L9 17l-5-5" />
									</svg>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
										<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
									</svg>
								{/if}
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	/* Add any custom font imports here if needed for Mon language */
	@font-face {
		font-family: 'PyidaungSu';
		src:
			local('PyidaungSu'),
			url('/fonts/PyidaungSu/Pyidaungsu-Regular.ttf') format('truetype');
		font-display: swap;
	}
	.font-mon {
		font-family: 'PyidaungSu', 'Myanmar Text', sans-serif;
	}
</style>
