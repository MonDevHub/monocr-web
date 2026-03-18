<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { initializeEngine, recognize, cleanup } from '$lib/monocr';
	import { CONFIG } from '$lib/config';
	import { renderPdfPage, loadPdf } from '$lib/utils/pdf-util';
	import { feedbackStore } from '$lib/stores/feedback';
	import { goto } from '$app/navigation';

	let engineReady = $state(false);
	let loading = $state(false);
	let error = $state<string | null>(null);

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let resultText = $state<string | null>(null);
	let processingTime = $state(0);
	let copied = $state(false);
	let isPdf = $state(false);
	let processingProgress = $state('');
	let totalPages = $state(0);
	let fileInput = $state<HTMLInputElement>();

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		// Drag feedback removed for minimalist simplicity
	}

	function handleDragLeave() {
		// Drag feedback removed for minimalist simplicity
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		const droppedFile = e.dataTransfer?.files[0];
		if (droppedFile) {
			handleFile({ detail: droppedFile } as CustomEvent<File>);
		}
	}

	function handleFileSelect(e: Event) {
		const selectedFile = (e.target as HTMLInputElement).files?.[0];
		if (selectedFile) {
			handleFile({ detail: selectedFile } as CustomEvent<File>);
		}
	}

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
			error = 'Invalid file type. Allowed: JPG, PNG, WEBP, PDF';
			return;
		}

		file = newFile;
		isPdf = file.type === 'application/pdf';

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

		if (isPdf) {
			processPdf();
		} else {
			previewUrl = URL.createObjectURL(file);
			processImage();
		}
	}

	async function processPdf() {
		if (!file) return;

		try {
			loading = true;
			resultText = '';
			const buffer = await file.arrayBuffer();

			// Load the PDF once to avoid detaching the buffer multiple times
			const pdf = await loadPdf(buffer);
			totalPages = pdf.numPages;

			const allTexts: string[] = [];
			const startTime = performance.now();

			for (let i = 1; i <= totalPages; i++) {
				processingProgress = `Processing page ${i} of ${totalPages}...`;

				// 1. Render page using the loaded pdf proxy
				const { imageBytes } = await renderPdfPage(pdf, i);

				// 2. Set preview for first page only
				if (i === 1) {
					if (previewUrl) URL.revokeObjectURL(previewUrl);
					const blob = new Blob([imageBytes.buffer as ArrayBuffer], { type: 'image/jpeg' });
					previewUrl = URL.createObjectURL(blob);
				}

				// 3. Run OCR
				const text = await recognize(imageBytes);
				if (text.trim()) {
					allTexts.push(`--- Page ${i} ---\n${text}`);
				}
			}

			resultText = allTexts.join('\n\n');
			const endTime = performance.now();
			processingTime = Math.round(endTime - startTime);
			processingProgress = '';
		} catch (e: unknown) {
			console.error(e);
			const msg = e instanceof Error ? e.message : String(e);
			error = `PDF Processing Failed: ${msg}`;
			processingProgress = '';
		} finally {
			loading = false;
		}
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

	async function reportError() {
		feedbackStore.set({
			text: resultText || '',
			previewUrl
		});
		await goto('/report');
	}
</script>

<div class="mx-auto w-full max-w-3xl">
	<!-- Header -->
	<header class="mb-8 space-y-4 text-center">
		<p
			class="text-fg-primary mx-auto mt-4 max-w-2xl text-[20px] leading-tight font-medium tracking-tight"
		>
			Private Mon OCR. Optimized for high-accuracy archival digitization, running entirely in your
			browser.
		</p>
		<p class="text-fg-muted mx-auto max-w-lg text-[12px] font-medium tracking-wide">
			Requires Hardware Acceleration (GPU) and 4GB+ RAM. Model (26.3MB) is cached locally for
			offline use.
		</p>

		<div class="flex justify-center pt-2">
			{#if !engineReady && !error}
				<div
					class="border-border bg-canvas-subtle text-fg-muted inline-flex items-center gap-2 rounded-md border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase"
				>
					<div class="bg-fg-muted h-1 w-1 animate-pulse rounded-full"></div>
					Initializing OCR Engine...
				</div>
			{:else if error}
				<div
					class="inline-flex items-center gap-2 rounded-md border border-red-100 bg-red-50/30 px-3 py-1 text-[11px] font-semibold tracking-wider text-red-600/80 uppercase dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
				>
					<div class="h-1 w-1 rounded-full bg-current"></div>
					{error}
				</div>
			{:else}
				<div
					class="border-border bg-canvas-subtle text-fg-muted inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase"
					in:fade
				>
					<div class="h-1 w-1 rounded-full bg-emerald-500/60 dark:bg-emerald-500/40"></div>
					Engine Ready
				</div>
			{/if}
		</div>
	</header>

	<!-- Main Content -->
	<main id="main-content" class="space-y-8">
		{#if !file}
			<div in:fade={{ duration: 300 }}>
				<div
					class="hover:bg-canvas-subtle group border-border relative flex flex-col items-center justify-center rounded-[var(--radius-huge)] border py-12 transition-all duration-250"
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					ondrop={handleDrop}
					onclick={() => fileInput?.click()}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && fileInput?.click()}
				>
					<input
						type="file"
						bind:this={fileInput}
						onchange={handleFileSelect}
						accept="image/*,application/pdf"
						class="hidden"
					/>

					<div class="flex flex-col items-center space-y-12 text-center">
						<div
							class="bg-primary/5 group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500"
						>
							<span
								class="material-symbols-outlined text-primary text-2xl font-light transition-transform duration-500 group-hover:scale-110"
							>
								upload
							</span>
						</div>

						<div class="space-y-4">
							<h3 class="text-fg-primary text-base font-semibold tracking-tight">
								Drop an image or PDF to begin
							</h3>
							<p class="text-fg-muted text-[13px] font-medium tracking-wide">
								Your data never leaves your device
							</p>
						</div>
					</div>
				</div>
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
						onclick={reset}
						class="text-fg-secondary hover:text-fg-primary hover:bg-canvas-subtle border-border bg-canvas flex min-h-[36px] items-center gap-2 rounded-lg border px-3 py-1 text-[11px] font-bold tracking-wider uppercase transition-all"
						aria-label="Process another image or PDF"
					>
						Process another image/PDF
					</button>
				</div>

				<!-- Result -->
				<div
					class="border-border bg-canvas flex min-h-[250px] flex-col overflow-hidden rounded-xl border shadow-sm"
				>
					<div
						class="border-border bg-canvas-subtle flex items-center justify-between border-b px-5 py-3"
					>
						<h2 class="section-label mb-0">Extracted Text</h2>
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
									<span class="text-fg-secondary text-sm font-medium">
										{processingProgress || 'Scanning...'}
									</span>
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
						<div
							class="border-border bg-canvas-subtle flex items-center justify-between border-t px-8 py-3"
						>
							<div class="flex items-center gap-4">
								<button
									class="btn-secondary px-4 py-1"
									onclick={downloadText}
									aria-label="Save extracted text as a file"
								>
									Download
								</button>
								<button
									class="btn-secondary px-4 py-1"
									onclick={() => {
										navigator.clipboard.writeText(resultText || '');
										copied = true;
										setTimeout(() => (copied = false), 2000);
									}}
									aria-label="Copy extracted text to clipboard"
								>
									{copied ? 'Copied' : 'Copy'}
								</button>
							</div>
							<div class="flex items-center">
								<button
									class="text-fg-secondary hover:text-primary group flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all"
									onclick={reportError}
									aria-label="Report Error or feedback for this result"
								>
									<span
										class="material-symbols-outlined text-[16px] opacity-40 group-hover:opacity-100"
										>flag</span
									>
									<span>Report</span>
								</button>
							</div>
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
