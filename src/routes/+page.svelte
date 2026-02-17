<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { initializeEngine, recognize, cleanup, OcrError } from '$lib/monocr';
	import { CONFIG } from '$lib/config';

	let engineReady = false;
	let loading = false;
	let error: string | null = null;

	let file: File | null = null;
	let previewUrl: string | null = null;
	let resultText: string | null = null;
	let processingTime = 0;

	onMount(async () => {
		try {
			loading = true;
			await initializeEngine();
			engineReady = true;
		} catch (e: any) {
			error = `Failed to load OCR engine: ${e.message || e}`;
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
			} catch {}
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
		} catch (e: any) {
			console.error(e);
			error = `OCR Failed: ${e.message || e}`;
		} finally {
			loading = false;
		}
	}

	function reset() {
		file = null;
		if (previewUrl) {
			try {
				URL.revokeObjectURL(previewUrl);
			} catch {}
		}
		previewUrl = null;
		resultText = null;
		error = null;
	}
</script>

	<div class="w-full">
		<!-- Header -->
		<!-- Header -->
		<header class="mb-12 space-y-6 text-center">
			<p class="mx-auto mt-12 max-w-2xl text-lg font-normal leading-relaxed text-fg-primary">
				Mon OCR that runs entirely in your browser — fast, private, and built to help bring Mon texts
				into the digital world.
			</p>

			{#if !engineReady && !error}
				<div
					class="inline-flex animate-pulse items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
				>
					<div class="h-1.5 w-1.5 rounded-full bg-current"></div>
					Initializing Engine...
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
					Engine Ready
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
				<div class="grid items-start gap-8 md:grid-cols-2" in:fly={{ y: 20, duration: 400 }}>
					<!-- Image Preview -->
					<div class="space-y-4">
						<div
							class="relative overflow-hidden rounded-xl border border-border bg-canvas-subtle shadow-sm"
						>
							<img
								src={previewUrl}
								alt="Preview"
								class="h-auto max-h-[500px] w-full object-contain"
							/>
						</div>
						<button
							on:click={reset}
							class="hover:text-fg-primary hover:decoration-fg-secondary text-sm text-fg-secondary underline decoration-border underline-offset-4 transition-colors"
						>
							Process another image
						</button>
					</div>

					<!-- Result -->
					<div
						class="flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border border-border bg-canvas shadow-sm"
					>
						<div
							class="flex items-center justify-between border-b border-border bg-canvas-subtle px-6 py-4"
						>
							<h2 class="font-semibold text-fg-primary">Extracted Text</h2>
							{#if processingTime > 0 && !loading}
								<span class="font-mono text-xs text-fg-secondary">{processingTime}ms</span>
							{/if}
						</div>

						<div class="relative flex-1 p-6">
							{#if loading}
								<div
									class="absolute inset-0 z-10 flex items-center justify-center bg-canvas/80 backdrop-blur-sm"
								>
									<div class="flex flex-col items-center gap-3">
										<div
											class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
										></div>
										<span class="text-sm font-medium text-fg-secondary"
											>Scanning...</span
										>
									</div>
								</div>
							{/if}

							{#if resultText}
								<div class="prose max-w-none dark:prose-invert">
									<p
										class="font-mon text-lg leading-relaxed whitespace-pre-wrap text-fg-primary"
									>
										{resultText}
									</p>
								</div>
							{:else if !loading}
								<div class="flex h-full items-center justify-center text-fg-secondary italic">
									No text extracted
								</div>
							{/if}
						</div>

						{#if resultText}
							<div
								class="flex justify-end border-t border-border bg-canvas-subtle px-4 py-3"
							>
								<button
									class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
									on:click={() => navigator.clipboard.writeText(resultText || '')}
								>
									Copy Text
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
