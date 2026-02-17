<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ThemeToggle from '../ui/ThemeToggle.svelte';
	import LanguageToggle from '../ui/LanguageToggle.svelte';
	import * as m from '$lib/paraglide/messages';

	let isSidebarOpen = $state(false);
	let isMobile = $state(false);
	let isScrolled = $state(false);

	let mediaQuery: MediaQueryList | null = null;
	let rafId: number | null = null;

	$effect(() => {
		if (!browser) return;

		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}

		if (isMobile && isSidebarOpen) {
			rafId = requestAnimationFrame(() => {
				document.body.style.overflow = 'hidden';
				rafId = null;
			});
		} else {
			rafId = requestAnimationFrame(() => {
				document.body.style.overflow = '';
				rafId = null;
			});
		}

		return () => {
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
		};
	});

	onMount(() => {
		if (!browser) return;

		mediaQuery = window.matchMedia('(max-width: 767px)');

		const updateMobile = (m: MediaQueryList | MediaQueryListEvent) => {
			isMobile = m.matches;
			if (!isMobile) {
				isSidebarOpen = false;
			}
		};

		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		updateMobile(mediaQuery);
		mediaQuery.addEventListener('change', updateMobile);
		window.addEventListener('scroll', handleScroll);

		return () => {
			if (mediaQuery) {
				mediaQuery.removeEventListener('change', updateMobile);
				mediaQuery = null;
			}
			window.removeEventListener('scroll', handleScroll);
			if (rafId !== null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			document.body.style.overflow = '';
		};
	});

	let triggerButton: HTMLButtonElement | undefined = $state();

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function closeSidebar() {
		// Return focus to the toggle button before closing
		// This prevents "aria-hidden" warnings by ensuring focus is not trapped in the hidden sidebar
		triggerButton?.focus();
		isSidebarOpen = false;
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape' && isSidebarOpen) {
			closeSidebar();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header
	class="fixed top-0 left-0 z-50 w-full transition-all duration-300 print:hidden"
	class:bg-canvas={isScrolled || isSidebarOpen}
	class:bg-opacity-90={isScrolled}
	class:dark:bg-opacity-90={isScrolled}
	class:backdrop-blur-sm={isScrolled}
	class:py-4={isScrolled}
	class:py-8={!isScrolled}
>
	<div class="mx-auto flex max-w-3xl items-baseline justify-between px-6 sm:px-8 lg:px-8">
		<!-- Empty space for clean header -->

		<!-- Mobile Toggle -->
		<button
			bind:this={triggerButton}
			onclick={toggleSidebar}
			class="flex min-h-[40px] min-w-[40px] touch-manipulation items-center justify-center rounded-md p-2 text-fg-secondary transition-all hover:bg-canvas-subtle hover:text-fg-primary focus:outline-none md:hidden"
			aria-label="Toggle navigation menu"
			aria-expanded={isSidebarOpen}
			type="button"
		>
			<img
				src="/icons/bars.svg"
				alt=""
				class="h-5 w-5 opacity-70 transition-all hover:opacity-100 dark:invert"
				width="20"
				height="20"
				fetchpriority="high"
				aria-hidden="true"
			/>
		</button>

		<!-- Desktop Nav -->
		<nav class="ml-auto hidden items-center space-x-6 md:flex" aria-label="Main navigation">
			<a
				class="text-sm font-medium transition-colors focus:outline-none {$page.url.pathname ===
				'/about'
					? 'text-fg-primary'
					: 'text-fg-secondary hover:text-fg-primary'}"
				href="/about"
			>
				{m['nav.about']()}
			</a>
			<a
				class="text-sm font-medium transition-colors focus:outline-none {$page.url.pathname ===
				'/services'
					? 'text-fg-primary'
					: 'text-fg-secondary hover:text-fg-primary'}"
				href="/services"
			>
				{m['nav.services']()}
			</a>
			<a
				class="text-sm font-medium text-fg-secondary transition-colors hover:text-fg-primary focus:outline-none {$page.url.pathname ===
				'/blog'
					? 'text-fg-primary'
					: 'text-fg-secondary hover:text-fg-primary'}"
				href="/blog"
			>
				{m['nav.blog']()}
			</a>

			<div class="flex items-center space-x-3 border-l border-border pl-6">
				<LanguageToggle />
				<ThemeToggle />
			</div>
		</nav>
	</div>
</header>

<!-- Mobile Overlay -->
<div
	class="pointer-events-none fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden"
	class:opacity-100={isSidebarOpen}
	class:opacity-0={!isSidebarOpen}
	class:pointer-events-auto={isSidebarOpen}
	onclick={closeSidebar}
	role="button"
	tabindex={isSidebarOpen ? 0 : -1}
	aria-hidden={!isSidebarOpen}
	onkeydown={(e) => e.key === 'Enter' && closeSidebar()}
></div>

<!-- Mobile Sidebar -->
<aside
	class="fixed top-0 left-0 z-[70] h-full w-64 transform border-r border-border bg-canvas shadow-2xl transition-transform duration-300 md:hidden"
	class:translate-x-0={isSidebarOpen}
	class:-translate-x-full={!isSidebarOpen}
	aria-hidden={!isSidebarOpen}
	inert={!isSidebarOpen}
>
	<div class="flex h-full flex-col p-6">
		<button
			onclick={closeSidebar}
			class="mb-8 flex min-h-[44px] min-w-[44px] items-center justify-center self-end p-2 text-fg-secondary hover:text-fg-primary"
			aria-label="Close menu"
			type="button"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<nav class="flex flex-col space-y-6 text-lg font-medium text-fg-secondary">
			<a
				onclick={closeSidebar}
				class="hover:border-fg-border block border-l-2 border-transparent pl-4 hover:text-fg-primary"
				href="/blog"
			>
				{m['nav.blog']()}
			</a>
			<a
				onclick={closeSidebar}
				class="block pl-4 {$page.url.pathname === '/about'
					? 'border-l-2 border-fg-accent font-semibold text-fg-primary'
					: 'hover:border-fg-border border-l-2 border-transparent hover:text-fg-primary'}"
				href="/about"
			>
				{m['nav.about']()}
			</a>
			<a
				onclick={closeSidebar}
				class="block pl-4 {$page.url.pathname === '/services'
					? 'border-l-2 border-fg-accent font-semibold text-fg-primary'
					: 'hover:border-fg-border border-l-2 border-transparent hover:text-fg-primary'}"
				href="/services"
			>
				{m['nav.services']()}
			</a>

			<div class="mt-auto border-t border-border pt-6">
				<div class="flex items-center justify-start gap-6">
					<LanguageToggle disabled={!isSidebarOpen} />
					<ThemeToggle />
				</div>
			</div>
		</nav>
	</div>
</aside>
