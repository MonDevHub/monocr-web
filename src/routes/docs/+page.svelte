<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { SEO } from '$lib/components';
	import { onMount } from 'svelte';

	let activeSection = $state('getting-started');

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.5, rootMargin: '-10% 0% -80% 0%' }
		);

		document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	});
</script>

<SEO
	title="Documentation - MonOCR Professional Academic OCR"
	description="Comprehensive guide for MonOCR engine, including installation, image quality standards, and technical architecture."
/>

<div class="font-public-sans text-fg-primary">
	<div class="flex">
		<!-- Left Sidebar Navigation -->
		<aside class="border-border hidden w-64 shrink-0 border-r px-5 py-8 lg:block">
			<div class="sticky top-24 flex flex-col gap-8">
				<div>
					<h3 class="text-fg-muted mb-4 px-3 text-[11px] font-bold tracking-[0.2em] uppercase">
						Core Concepts
					</h3>
					<nav class="flex flex-col gap-1">
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all active:scale-[0.98]"
							href="#introduction"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">info</span> Introduction
						</a>
						<a
							class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all active:scale-[0.95] {activeSection ===
							'getting-started'
								? 'bg-canvas-subtle text-fg-primary'
								: 'text-fg-secondary hover:bg-canvas-subtle/50 hover:text-fg-primary'}"
							href="#getting-started"
						>
							<span
								class="material-symbols-outlined text-[18px] {activeSection === 'getting-started'
									? 'opacity-100'
									: 'opacity-60'}">rocket_launch</span
							> Getting Started
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all active:scale-[0.98]"
							href="#image-quality"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">high_quality</span> Quality
							Standards
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all active:scale-[0.98]"
							href="/report"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">edit_note</span> Feedback
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all active:scale-[0.98]"
							href="/contribute"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70"
								>volunteer_activism</span
							> Contribute
						</a>
					</nav>
				</div>

				<div>
					<h3 class="section-label px-3">Integration</h3>
					<nav class="flex flex-col gap-1">
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
							href="#cli"
						>
							<span class="material-symbols-outlined text-lg">terminal</span> CLI Reference
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
							href="#sdk"
						>
							<span class="material-symbols-outlined text-lg">code</span> Python SDK
						</a>
					</nav>
				</div>

				<div>
					<h3 class="section-label px-3">Legal & Privacy</h3>
					<nav class="flex flex-col gap-1">
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors {activeSection ===
							'privacy'
								? 'bg-primary/10 text-primary font-bold'
								: ''}"
							href="#privacy"
						>
							<span class="material-symbols-outlined text-lg">shield</span> Privacy Policy
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
							href="#license"
						>
							<span class="material-symbols-outlined text-lg">gavel</span> License
						</a>
					</nav>
				</div>
			</div>
		</aside>

		<!-- Main Page Flow -->
		<main id="main-content" class="min-w-0 flex-1 px-4 py-12 sm:px-6 lg:px-12 xl:px-20">
			<div class="mx-auto flex max-w-7xl flex-col gap-12 xl:flex-row">
				<!-- Article Content -->
				<div class="min-w-0 flex-1 xl:max-w-4xl">
					<!-- Breadcrumbs -->
					<nav class="text-fg-muted mb-8 flex items-center gap-2 text-[12px] font-medium">
						<a class="hover:text-fg-primary transition-colors" href="/"> Docs </a>
						<span class="opacity-30">/</span>
						<span class="text-fg-primary">Getting Started</span>
					</nav>

					<section id="introduction" class="mb-10">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">Documentation</h1>
						<p class="text-fg-muted text-base leading-relaxed">
							Academic-grade OCR engine for Mon script. High-performance, private, and localized.
						</p>
					</section>

					<!-- Getting Started Section -->
					<section id="getting-started" class="mb-12 scroll-mt-24">
						<h2 class="mb-4 flex items-center gap-3 text-xl font-bold tracking-tight">
							<span
								class="bg-canvas-subtle text-fg-secondary flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
								>1</span
							>
							Installation
						</h2>
						<p class="text-fg-muted mb-4">
							Install the latest stable release of the MonOCR engine via our package manager. We
							recommend using a virtual environment for academic consistency.
						</p>
						<div class="group relative">
							<pre
								class="border-border bg-canvas-subtle text-fg-primary overflow-x-auto rounded-xl border p-5 font-mono text-xs">pip install monocr-engine --upgrade</pre>
							<button
								class="hover:text-primary text-fg-muted hover:bg-canvas/50 absolute top-3 right-3 rounded-md p-2 opacity-40 transition-opacity hover:opacity-100"
								aria-label="Copy to clipboard"
							>
								<span class="material-symbols-outlined text-base">content_copy</span>
							</button>
						</div>
					</section>

					<!-- Quick Start Example -->
					<section id="quick-start" class="mb-12 scroll-mt-24">
						<h2 class="mb-4 flex items-center gap-3 text-xl font-bold tracking-tight">
							<span
								class="bg-canvas-subtle text-fg-secondary flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
								>2</span
							>
							Quick Start Example
						</h2>
						<p class="text-fg-muted mb-4">
							Initialize the processor and run text detection on a high-resolution scan.
						</p>
						<div class="group relative">
							<pre
								class="border-border bg-canvas-subtle text-fg-primary overflow-x-auto rounded-xl border p-5 font-mono text-xs">import monocr

# Initialize with academic weights
engine = monocr.Engine(preset='academic-v2')

# Process image
result = engine.process('manuscript_scan_001.tiff')

# Export to structured JSON
print(result.to_json())</pre>
						</div>
					</section>

					<hr class="border-border my-16" />

					<section class="mb-12 scroll-mt-24" id="image-quality">
						<h2 class="mb-4 text-2xl font-bold">Input Standards</h2>
						<p class="text-fg-secondary mb-8">
							Follow these standards to achieve maximum accuracy (99.8%+).
						</p>
						<div class="grid gap-6 sm:grid-cols-2">
							<!-- Resolution Card -->
							<div
								class="border-border bg-canvas rounded-xl border p-6 shadow-sm transition-all hover:shadow-md"
							>
								<span class="material-symbols-outlined text-primary mb-4 text-3xl"
									>photo_camera</span
								>
								<h3 class="mb-2 text-sm font-bold">Resolution</h3>
								<p class="text-fg-secondary text-xs leading-relaxed">
									Aim for a minimum of 300 DPI. For micro-text or ancient manuscripts, 600 DPI is
									required.
								</p>
							</div>
							<!-- Lighting Card -->
							<div
								class="border-border bg-canvas rounded-xl border p-6 shadow-sm transition-all hover:shadow-md"
							>
								<span class="material-symbols-outlined text-primary mb-4 text-3xl">light_mode</span>
								<h3 class="mb-2 text-sm font-bold">Lighting</h3>
								<p class="text-fg-secondary text-xs leading-relaxed">
									Use diffuse lighting to minimize glares and deep shadows that can confuse the
									segmenter.
								</p>
							</div>
						</div>
					</section>

					<section
						class="bg-primary/5 border-primary/10 mb-12 scroll-mt-24 rounded-xl border p-8"
						id="privacy"
					>
						<h2 class="mb-4 flex items-center gap-3 text-2xl font-bold">
							<span class="material-symbols-outlined text-primary">security</span>
							Privacy-First OCR
						</h2>
						<p class="text-fg-secondary mb-6 text-sm leading-relaxed">
							Documents are processed entirely on your local machine. No data is uploaded to our
							servers.
						</p>
					</section>

					<section
						class="bg-primary/5 dark:bg-primary/10 border-primary/10 mb-12 scroll-mt-24 rounded-xl border p-6"
						id="privacy"
					>
						<h2 class="mb-3 flex items-center gap-2 text-xl font-bold">
							<span class="material-symbols-outlined text-primary">security</span>
							Privacy-First OCR
						</h2>
						<p class="text-fg-muted mb-4 text-sm leading-relaxed">
							Documents are processed entirely on your local machine. No data is uploaded to our
							servers.
						</p>
						<div class="text-primary mb-6 flex items-center gap-2 text-xs font-semibold">
							<span class="material-symbols-outlined text-base">shield_lock</span>
							<span>100% Local Processing • No Data Leaves Your Device</span>
						</div>
						<ul class="text-fg-muted space-y-2 text-xs">
							<li class="flex items-center gap-2">
								<span class="material-symbols-outlined text-primary text-[14px]">check_circle</span>
								Localized data handling (GDPR/CCPA compliant).
							</li>
							<li class="flex items-center gap-2">
								<span class="material-symbols-outlined text-primary text-[14px]">check_circle</span>
								Opt-in, anonymous performance telemetry.
							</li>
						</ul>
					</section>

					<!-- Technical Engine Section -->
					<section id="technology" class="mb-24 scroll-mt-24">
						<h3 class="section-label">Technical Engine</h3>
						<div class="border-border bg-canvas-subtle rounded-xl border p-8">
							<div class="mb-4 flex items-center gap-3">
								<span class="material-symbols-outlined text-primary">precision_manufacturing</span>
								<h4 class="text-fg-primary text-sm font-bold tracking-wider uppercase">
									Neural Architecture
								</h4>
							</div>
							<p class="text-fg-muted mb-4 text-sm leading-relaxed">
								MonOCR uses a neural-network architecture (MobileNetV3 + BiLSTM) optimized for
								archival digitization. Inference runs entirely in your browser using WebGPU/WASM for
								speed and privacy.
							</p>
						</div>
					</section>

					<!-- Heritage Section -->
					<section id="heritage" class="mb-24 scroll-mt-24">
						<h3 class="section-label">Preserving Mon Heritage</h3>
						<div class="prose prose-sm max-w-none space-y-4 dark:prose-invert">
							<p class="text-fg-muted leading-relaxed font-medium">
								Mon (mnw) is a vulnerable language with limited digital presence. Most written
								knowledge remains locked in analog scans, making it difficult to build modern
								digital tools.
							</p>
							<p class="text-fg-muted/60 text-xs leading-relaxed italic">
								Your contributions directly help digitize this history. Every document or typed
								script improves our specialized AI model, enabling future research and linguistic
								preservation.
							</p>
						</div>
					</section>

					<section id="cli" class="mb-24 scroll-mt-24">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">CLI Reference</h1>
						<p class="text-fg-muted text-base leading-relaxed">
							Full command-line interface documentation for terminal-based digitization workflows.
						</p>
						<div class="border-border bg-canvas-subtle mt-8 rounded-xl border p-6">
							<code class="text-xs">monocr --help</code>
						</div>
					</section>

					<section id="sdk" class="mb-24 scroll-mt-24">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">Python SDK</h1>
						<p class="text-fg-muted text-base leading-relaxed">
							Library features, API classes, and integration patterns for Python developers.
						</p>
					</section>

					<section id="license" class="mb-24 scroll-mt-24">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">License</h1>
						<p class="text-fg-muted text-base leading-relaxed">
							MonOCR is released under the academic open-source license.
						</p>
					</section>

					<!-- Footer Navigation -->
					<footer class="border-border flex items-center justify-between border-t py-10">
						<div class="flex flex-col">
							<p class="text-fg-muted mb-1 text-xs font-bold uppercase">Previous</p>
							<a
								class="text-primary group flex items-center gap-1 text-xs font-bold hover:underline"
								href="#introduction"
							>
								<span
									class="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1"
									>arrow_back</span
								> Introduction
							</a>
						</div>
						<div class="flex flex-col items-end">
							<p class="text-fg-muted mb-1 text-xs font-bold uppercase">Next</p>
							<a
								class="text-primary group flex items-center gap-1 text-xs font-bold hover:underline"
								href="#cli"
							>
								CLI Reference <span
									class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1"
									>arrow_forward</span
								>
							</a>
						</div>
					</footer>
				</div>

				<!-- Page Outline (Right Sidebar - Sticky) -->
				<aside class="hidden w-48 shrink-0 xl:block">
					<div class="sticky top-24">
						<h4 class="section-label">On this page</h4>
						<nav class="border-border flex flex-col gap-3 border-l pl-4">
							<a
								class="text-xs font-medium transition-colors {activeSection === 'getting-started'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#getting-started">Installation</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'technology'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#technology">Technical Engine</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'heritage'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#heritage">Mon Heritage</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'image-quality'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#image-quality">Quality Tips</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'privacy'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#privacy">Privacy Policy</a
							>
						</nav>
					</div>
				</aside>
			</div>
		</main>
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Material symbols font size adjustments if needed */
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
</style>
