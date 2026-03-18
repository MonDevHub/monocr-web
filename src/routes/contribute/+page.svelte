<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { SEO } from '$lib/components';
	import { goto } from '$app/navigation';

	let transcription = $state('');
	let fileInput: HTMLInputElement;

	async function handleSubmit() {
		if (!transcription) return;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Success
		alert('Thank you for contributing to MonOCR!');
		await goto('/');
	}
</script>

<SEO
	title="Contribute - MonOCR Help Preserve Heritage"
	description="Contribute Mon documents and transcriptions to help improve OCR accuracy and preserve the Mon language."
/>

<div class="font-display flex flex-col">
	<!-- Header removed to use global Header -->

	<main id="main-content" class="flex-1 overflow-y-auto pb-8">
		<div class="mx-auto max-w-2xl px-6 py-2">
			<header class="mb-2 text-center">
				<h2 class="text-fg-primary mb-0.5 text-[18px] font-semibold tracking-tight">
					Help Preserve Heritage
				</h2>
				<p class="text-fg-muted text-[13px] font-medium tracking-wide">
					Your contributions help improve OCR accuracy for the Mon script.
				</p>
			</header>

			<!-- Section 1: Upload -->
			<section class="mb-5">
				<div
					class="hover:bg-canvas-subtle group border-border relative flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-huge)] border py-6 transition-all duration-250"
					onclick={() => fileInput.click()}
					onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
					role="button"
					tabindex="0"
				>
					<input
						type="file"
						bind:this={fileInput}
						class="hidden"
						multiple
						accept=".pdf,.docx,.txt,image/*"
					/>
					<div class="flex flex-col items-center space-y-3 text-center">
						<div
							class="bg-primary/5 group-hover:bg-primary/10 flex h-12 w-12 items-center justify-center rounded-md transition-all duration-500"
						>
							<span
								class="material-symbols-outlined text-primary text-xl font-light transition-transform duration-500 group-hover:scale-110"
							>
								upload_file
							</span>
						</div>
						<div class="space-y-1">
							<h3 class="text-fg-primary text-sm font-semibold tracking-tight">Upload Mon scans</h3>
							<p class="text-fg-muted text-[11px] font-medium tracking-wide uppercase opacity-60">
								PDF, Images, or Text
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Divider -->
			<div class="relative mx-auto mb-2 flex max-w-xs items-center py-1 opacity-30">
				<div class="border-border flex-grow border-t"></div>
				<span
					class="text-fg-muted mx-4 flex-shrink text-[10px] font-bold tracking-[0.2em] uppercase"
					>OR</span
				>
				<div class="border-border flex-grow border-t"></div>
			</div>

			<!-- Section 2: Textarea -->
			<section class="mb-5">
				<h3 class="text-fg-muted mb-2 text-[11px] font-bold tracking-[0.2em] uppercase">
					Type Mon Script
				</h3>
				<div class="relative">
					<textarea
						bind:value={transcription}
						class="focus:ring-primary/5 focus:border-primary/20 font-mon border-border bg-canvas placeholder:text-fg-muted/30 w-full resize-y rounded-[var(--radius-lg)] border p-4 text-base leading-relaxed transition-all duration-250 placeholder:text-[12px] focus:ring-4"
						placeholder="Example: မန်ဒိုင် (Type or paste the Mon script here)..."
					></textarea>
				</div>
			</section>

			<!-- Submit Action -->
			<div class="mx-auto mb-4 w-full max-w-md">
				<button
					onclick={handleSubmit}
					disabled={!transcription}
					class="btn-primary w-full shadow-sm"
				>
					Submit Contribution
				</button>
			</div>
		</div>
	</main>
</div>

<style>
	/* Any Mon-specific typography needs for the textarea */
</style>
