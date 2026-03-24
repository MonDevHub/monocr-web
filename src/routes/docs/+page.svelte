<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { SEO } from '$lib/components';
	import { onMount } from 'svelte';

	let activeSection = $state('getting-started');
	let selectedSdk = $state('js');

	const sdks = [
		{ id: 'js', name: 'JavaScript', icon: 'JS', color: '#f7df1e', text: 'black', pkg: 'monocr' },
		{
			id: 'python',
			name: 'Python',
			icon: 'PY',
			color: '#3776ab',
			text: 'white',
			pkg: 'monocr-onnx'
		},
		{ id: 'go', name: 'Go', icon: 'GO', color: '#00add8', text: 'white', pkg: 'monocr-onnx/go' },
		{ id: 'rust', name: 'Rust', icon: 'RS', color: '#dea584', text: 'white', pkg: 'monocr-onnx' }
	];

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

		// Handle initial hash for SDK selection
		const hash = window.location.hash.replace('#', '');
		if (['js', 'python', 'go', 'rust', 'cli', 'nodejs'].includes(hash)) {
			if (hash === 'cli') selectedSdk = 'python';
			else if (hash === 'nodejs') selectedSdk = 'js';
			else selectedSdk = hash;
		}

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
		<aside class="border-border hidden w-64 shrink-0 border-r px-4 py-8 lg:block">
			<div class="sticky top-24 flex flex-col gap-8">
				<div>
					<h3
						class="text-fg-muted mb-4 px-3 font-bold tracking-[0.2em] text-[var(--text-meta)] uppercase"
					>
						Core Concepts
					</h3>
					<nav class="flex flex-col gap-1">
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[var(--text-body)] transition-all active:scale-[0.98]"
							href="#introduction"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">info</span> Introduction
						</a>
						<a
							class="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[var(--text-body)] transition-all active:scale-[0.95] {activeSection ===
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
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[var(--text-body)] transition-all active:scale-[0.98]"
							href="#image-quality"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">high_quality</span> Quality
							Standards
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[var(--text-body)] transition-all active:scale-[0.98]"
							href="/report"
						>
							<span class="material-symbols-outlined text-[18px] opacity-70">edit_note</span> Feedback
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-[var(--text-body)] transition-all active:scale-[0.98]"
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
							href="#huggingface"
						>
							<span class="material-symbols-outlined text-lg">cloud_download</span> Model Hub (HF)
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
							href="#sdks"
						>
							<span class="material-symbols-outlined text-lg">code</span> Multi-Language SDKs
						</a>
						<a
							class="hover:bg-canvas-subtle flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors {activeSection ===
							'cli-reference'
								? 'bg-primary/10 text-primary font-bold'
								: ''}"
							href="#cli-reference"
						>
							<span class="material-symbols-outlined text-lg">terminal</span> CLI Reference
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
		<main id="main-content" class="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
			<div class="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
				<!-- Article Content -->
				<div class="min-w-0 flex-1 xl:max-w-4xl">
					<!-- Breadcrumbs -->
					<nav class="text-fg-muted mb-8 flex items-center gap-2 text-[12px] font-medium">
						<a class="hover:text-fg-primary transition-colors" href="/"> Docs </a>
						<span class="opacity-30">/</span>
						<span class="text-fg-primary">Getting Started</span>
					</nav>

					<section id="introduction" class="mb-10">
						<h1 class="mb-3 font-bold tracking-tight text-[var(--text-title)]">Documentation</h1>
						<p class="text-fg-muted leading-relaxed text-[var(--text-section)]">
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
								class="border-border bg-canvas-subtle text-fg-primary overflow-x-auto rounded-xl border p-4 font-mono text-[var(--text-meta)]">pip install monocr</pre>
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
								class="border-border bg-canvas-subtle text-fg-primary overflow-x-auto rounded-xl border p-5 font-mono text-xs"># 1. Install engine
pip install monocr

# 2. Run OCR
from monocr import MonOCR
ocr = MonOCR()
text = ocr.predict('document_scan.png')
print(text)</pre>
						</div>
					</section>

					<hr class="border-border my-16" />

					<section class="mb-12 scroll-mt-24" id="image-quality">
						<h2 class="mb-4 text-2xl font-bold">Input Standards</h2>
						<p class="text-fg-secondary mb-8">
							Follow these standards to achieve maximum recognition accuracy (97.5%+).
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
							<p class="text-fg-muted leading-relaxed font-medium text-[var(--text-body)]">
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

					<section id="huggingface" class="mb-24 scroll-mt-24">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">Model Hub (Hugging Face)</h1>
						<p class="text-fg-muted mb-6 text-base leading-relaxed">
							Our production weights and multi-format exports are hosted on Hugging Face for direct
							access.
						</p>
						<div class="border-border bg-canvas-subtle rounded-xl border p-8">
							<h3 class="mb-4 text-sm font-bold tracking-wider uppercase">Direct Access</h3>
							<p class="text-fg-muted mb-6 text-sm">
								You can download models directly for custom implementations or specialized
								deployment environments.
							</p>
							<div class="grid gap-4 sm:grid-cols-2">
								<a
									href="https://huggingface.co/janakhpon/monocr"
									class="border-border hover:bg-canvas flex items-center justify-between rounded-lg border p-4 transition-colors"
								>
									<div>
										<div class="text-sm font-bold">ONNX Format</div>
										<div class="text-fg-muted text-xs">Standard inference</div>
									</div>
									<span class="material-symbols-outlined text-sm">open_in_new</span>
								</a>
								<a
									href="https://huggingface.co/janakhpon/monocr"
									class="border-border hover:bg-canvas flex items-center justify-between rounded-lg border p-4 transition-colors"
								>
									<div>
										<div class="text-sm font-bold">Core ML</div>
										<div class="text-fg-muted text-xs">Apple ecosystem</div>
									</div>
									<span class="material-symbols-outlined text-sm">open_in_new</span>
								</a>
							</div>
						</div>
					</section>

					<section id="cli-reference" class="mb-24 scroll-mt-24">
						<header class="mb-8">
							<h1 class="mb-3 text-2xl font-bold tracking-tight">CLI Reference</h1>
							<p class="text-fg-muted text-base leading-relaxed">
								Use the command line interface for processing large PDFs (>50MB) or batch folders.
							</p>
						</header>

						<div class="space-y-8">
							<div class="space-y-3">
								<h3 class="text-sm font-bold tracking-wider uppercase">Installation</h3>
								<pre
									class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">pip install monocr</pre>
							</div>

							<div class="space-y-3">
								<h3 class="text-sm font-bold tracking-wider uppercase">Basic Usage</h3>
								<div class="grid gap-4">
									<div class="border-border bg-canvas rounded-lg border p-4">
										<div class="text-fg-primary mb-2 text-xs font-bold uppercase">Read Image</div>
										<pre
											class="bg-canvas-subtle rounded-md p-2 font-mono text-xs">monocr read image.png</pre>
									</div>
									<div class="border-border bg-canvas rounded-lg border p-4">
										<div class="text-fg-primary mb-2 text-xs font-bold uppercase">
											Batch Processing
										</div>
										<pre
											class="bg-canvas-subtle rounded-md p-2 font-mono text-xs">monocr batch folder_path/</pre>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section id="sdks" class="mb-24 scroll-mt-24">
						<header class="mb-8">
							<h1 class="mb-3 text-2xl font-bold tracking-tight">Multi-Platform SDKs</h1>
							<p class="text-fg-muted text-base leading-relaxed">
								Official libraries for high-performance inference. Optimized for archival
								digitization and research.
							</p>
						</header>

						<!-- SDK Tab Switcher -->
						<div class="border-border bg-canvas-subtle mb-8 flex gap-1 rounded-xl border p-1">
							{#each sdks as sdk (sdk.id)}
								<button
									onclick={() => (selectedSdk = sdk.id)}
									class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all {selectedSdk ===
									sdk.id
										? 'bg-canvas text-fg-primary shadow-sm'
										: 'text-fg-muted hover:text-fg-primary'}"
								>
									<div
										class="flex h-5 w-5 items-center justify-center rounded-[4px] text-[8px] font-black"
										style="background-color: {sdk.color}; color: {sdk.text};"
									>
										{sdk.icon}
									</div>
									{sdk.name}
								</button>
							{/each}
						</div>
						<!-- SDK Content -->
						<div class="space-y-10">
							<!-- JavaScript SDK -->
							<div id="js" class="animate-fade-in space-y-6" hidden={selectedSdk !== 'js'}>
								<div class="space-y-3">
									<h3 id="nodejs" class="text-sm font-bold tracking-wider uppercase">
										Getting Started (Node.js)
									</h3>
									<pre
										class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">// 1. Install
npm install monocr

// 2. Use
import &#123; MonOCR &#125; from 'monocr';
const ocr = new MonOCR();
const text = await ocr.predict('page.jpg');</pre>
								</div>
							</div>

							<!-- Python SDK -->
							<div id="python" class="animate-fade-in space-y-6" hidden={selectedSdk !== 'python'}>
								<div class="space-y-3">
									<h3 id="cli" class="text-sm font-bold tracking-wider uppercase">
										Installation (Python/CLI)
									</h3>
									<pre
										class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">pip install monocr-onnx</pre>
								</div>

								<div class="space-y-3">
									<h3 class="text-sm font-bold tracking-wider uppercase">Usage Guide</h3>
									<pre
										class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">from monocr import MonOCR

ocr = MonOCR()

# 1. Read Image
text = ocr.predict("page.jpg")

# 2. Read PDF Document
pdf_text = ocr.predict("archival.pdf")

# 3. Extract Accuracy / Confidence
res = ocr.predict_with_confidence("sample.png")
print(f"Confidence: &#123;res['confidence']:.2%&#125;")</pre>
								</div>
							</div>

							<!-- Go SDK -->
							<div id="go" class="animate-fade-in space-y-6" hidden={selectedSdk !== 'go'}>
								<div class="space-y-3">
									<h3 class="text-sm font-bold tracking-wider uppercase">Getting Started (Go)</h3>
									<pre
										class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">// 1. Install
go get github.com/MonDevHub/monocr-onnx/go

// 2. Use
import "github.com/MonDevHub/monocr-onnx/go/pkg/ocr"
engine, _ := ocr.NewMonOCR("")
text, _ := engine.Predict("page.jpg")</pre>
								</div>
							</div>

							<!-- Rust SDK -->
							<div id="rust" class="animate-fade-in space-y-6" hidden={selectedSdk !== 'rust'}>
								<div class="space-y-3">
									<h3 class="text-sm font-bold tracking-wider uppercase">Getting Started (Rust)</h3>
									<pre
										class="border-border bg-canvas-subtle overflow-x-auto rounded-xl border p-5 font-mono text-xs">// 1. Install (cargo add)
cargo add monocr-onnx

// 2. Use
use monocr_onnx::MonOCR;
let ocr = MonOCR::new("monocr.onnx")?;
let text = ocr.predict("page.jpg")?;</pre>
								</div>
							</div>
						</div>
					</section>

					<section id="license" class="mb-24 scroll-mt-24">
						<h1 class="mb-3 text-2xl font-bold tracking-tight">License</h1>
						<p class="text-fg-muted text-base leading-relaxed">
							MonOCR is released under the MIT License.
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
								class="text-xs font-medium transition-colors {activeSection === 'huggingface'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#huggingface">Model Hub</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'sdks'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#sdks">Platform SDKs</a
							>
							<a
								class="text-xs font-medium transition-colors {activeSection === 'cli-reference'
									? 'text-primary'
									: 'text-fg-muted hover:text-fg-primary'}"
								href="#cli-reference">CLI Reference</a
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
