<script lang="ts">
</script>

<svelte:head>
	<title>Privacy & Trust - MonOCR</title>
	<meta name="description" content="MonOCR Privacy - 100% Local, 100% Private" />
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-12 sm:py-16">
	<!-- Hero Section -->
	<header class="mb-12 text-center">
		<div
			class="bg-fg-accent/10 text-fg-accent mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px]"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-7 w-7"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
				/>
			</svg>
		</div>
		<h1 class="text-fg-primary mb-4 text-4xl font-black tracking-tight sm:text-5xl">
			Privacy by Design
		</h1>
		<p class="text-fg-secondary mx-auto max-w-2xl text-lg">
			MonOCR was built with a fundamental rejection of cloud-based surveillance. All processing
			happens entirely on your local hardware.
		</p>
	</header>

	<!-- Privacy Pillars -->
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">1. Zero Data Collection</h2>
			<p class="text-fg-secondary leading-relaxed">
				We do not use telemetry, tracked accounts, or cookies. Your identity and your documents
				remain entirely anonymous to us.
			</p>
		</section>

		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">2. Local Edge-AI</h2>
			<p class="text-fg-secondary leading-relaxed">
				Recognition runs in your browser via WASM/WebGPU or on-device NPU. Images never upload,
				ensuring peak performance and total isolation.
			</p>
		</section>

		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">3. Voluntary Feedback</h2>
			<p class="text-fg-secondary leading-relaxed">
				History and contributions are stored in a local browser database (Dexie). Sharing data for
				model improvement is 100% opt-in.
			</p>
		</section>

		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-6H3m12 0h-1.5m1.5 0H21m-10.5 0a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 0 0-7.5 0Zm-6 9h1.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">4. Rolling Diagnostics</h2>
			<p class="text-fg-secondary leading-relaxed">
				We don't use cloud crash reporters. Logs are kept in your local console and memory. You hold
				the keys to all debug information.
			</p>
		</section>

		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">5. Persistent Policy</h2>
			<p class="text-fg-secondary leading-relaxed">
				Our zero-collection architecture makes policy changes rare. Any updates are documented in
				our open source repositories.
			</p>
		</section>

		<section
			class="bg-canvas-subtle border-border group hover:bg-canvas rounded-[var(--radius-huge)] border p-6 transition-all dark:bg-white/5"
		>
			<div
				class="bg-fg-accent/10 text-fg-accent mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] transition-transform group-hover:scale-110"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
					/>
				</svg>
			</div>
			<h2 class="text-fg-primary mb-3 text-xl font-bold">6. Direct Contact</h2>
			<p class="text-fg-secondary leading-relaxed">
				Connect with the MonDevHub engineering team directly on GitHub. We value transparency and
				academic heritage above all.
			</p>
		</section>
	</div>

	<footer class="border-border/50 mt-12 border-t pt-8 pb-4 text-center">
		<p class="text-fg-muted font-medium tracking-wide text-[var(--text-meta)]">
			Effective Date: March 21, 2026 • MonOCR Version 2.1.2
		</p>
	</footer>
</div>
