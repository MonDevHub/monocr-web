<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { feedbackStore } from '$lib/stores/feedback';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SEO } from '$lib/components';

	let originalText = $state('');
	let correctedText = $state('');
	let previewUrl = $state<string | null>(null);
	let selectedType = $state('Spelling');
	let consent = $state(false);
	let sourceFile = $state<File | null>(null);
	let sourceFileInput: HTMLInputElement;

	onMount(() => {
		const data = get(feedbackStore);
		if (data.text) {
			originalText = data.text;
			correctedText = data.text;
			previewUrl = data.previewUrl || null;
		}
	});

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			sourceFile = target.files[0];
			// For preview if it's an image
			if (sourceFile.type.startsWith('image/')) {
				previewUrl = URL.createObjectURL(sourceFile);
			}
		}
	}

	async function handleSubmit() {
		if (!correctedText || !consent) return;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Success
		alert('Thank you for helping improve MonOCR!');
		await goto('/');
	}

	async function handleCancel() {
		await goto('/');
	}
</script>

<SEO
	title="Improve Accuracy - MonOCR Community Correction"
	description="Help improve our Mon language model by submitting corrections for OCR results."
/>

<div class="font-display relative flex flex-col overflow-x-hidden">
	<main id="main-content" class="mx-auto w-full max-w-2xl space-y-6 p-6 md:p-10">
		<!-- Original Source Selection -->
		<section>
			<h3 class="section-label">Original Source</h3>
			<div
				class="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-canvas-subtle/50 py-6 transition-all hover:bg-canvas-subtle/80"
				onclick={() => sourceFileInput.click()}
				onkeydown={(e) => e.key === 'Enter' && sourceFileInput.click()}
				role="button"
				tabindex="0"
			>
				<input
					bind:this={sourceFileInput}
					type="file"
					class="hidden"
					accept="image/*,application/pdf"
					onchange={handleFileChange}
				/>
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-canvas-subtle">
						<span class="material-symbols-outlined text-fg-muted text-lg">upload_file</span>
					</div>
					<div class="text-left">
						<p class="text-[13px] font-semibold text-fg-primary">
							{sourceFile ? sourceFile.name : 'Upload Original Scan'}
						</p>
						<p class="text-[10px] text-fg-muted uppercase tracking-wider">Image or PDF</p>
					</div>
				</div>
			</div>
		</section>

		{#if originalText}
			<!-- Original Output Section -->
			<section>
				<h3 class="section-label">Original Output</h3>
				<div
					class="overflow-hidden rounded-lg border border-border bg-canvas-subtle"
				>
					<div class="p-4">
						<div class="flex flex-col gap-4">
							{#if previewUrl}
								<div
									class="relative aspect-video w-full overflow-hidden rounded border border-border bg-canvas-subtle"
								>
									<img
										src={previewUrl}
										alt="Source Scan"
										class="absolute inset-0 h-full w-full object-contain"
									/>
								</div>
							{/if}
								<p
									class="border-primary/40 border-l-2 bg-canvas-subtle/50 py-1.5 pl-4 text-sm leading-relaxed text-fg-secondary italic"
								>
									"{originalText}"
								</p>
								<div class="flex items-center gap-2 text-xs text-fg-muted">
									<span class="material-symbols-outlined text-sm">info</span>
									<span>Report quality issues to help improve our model</span>
								</div>
						</div>
					</div>
				</div>
			</section>
		{/if}

		<!-- Corrected Text Section -->
		<section>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="section-label mb-0">Corrected Text</h3>
				<span
					class="text-[9px] font-medium tracking-widest text-fg-muted uppercase"
					>Verified by humans</span
				>
			</div>
			<div class="flex flex-col gap-4">
				<label class="block">
					<textarea
						bind:value={correctedText}
						class="form-textarea focus:border-primary focus:ring-primary/5 block w-full rounded-lg border border-border bg-canvas px-4 py-3 text-sm text-fg-primary placeholder-fg-muted"
						rows="4"
						placeholder="Corrected Mon script..."
					></textarea>
				</label>
			</div>
		</section>

		<!-- Error Categories -->
		<section>
			<h3 class="section-label">Error Type</h3>
			<div class="flex flex-wrap gap-2">
				{#each ['Spelling', 'Layout', 'Formatting', 'Other'] as type (type)}
					<button
						onclick={() => (selectedType = type)}
						class="rounded-full border px-3 py-1 text-[10px] font-bold transition-all {selectedType ===
						type
							? 'border-primary bg-primary text-white'
							: 'border-border text-fg-muted hover:border-fg-secondary hover:bg-canvas-subtle'}"
					>
						{type}
					</button>
				{/each}
			</div>
		</section>

		<!-- Consent & Actions -->
		<section class="space-y-6 border-t border-border pt-4">
			<div class="flex items-start gap-4">
				<div class="flex h-5 items-center">
					<input
						type="checkbox"
						id="consent"
						bind:checked={consent}
						class="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-border bg-canvas"
					/>
				</div>
				<div class="text-[13px]">
					<label
						class="cursor-pointer font-bold tracking-tight text-fg-primary uppercase"
						for="consent">I want to help improve MonOCR</label
					>
					<p class="leading-snug text-fg-muted opacity-80">
						Allow this correction to be used for research and academic model improvements.
					</p>
				</div>
			</div>
			<div class="mx-auto flex w-full max-w-sm flex-col gap-2 pt-6">
				<button
					onclick={handleSubmit}
					disabled={!correctedText || !consent}
					class="btn-primary w-full"
				>
					Share Correction
				</button>
				<button onclick={handleCancel} class="btn-secondary w-full"> Cancel and discard </button>
			</div>
		</section>
	</main>
</div>
