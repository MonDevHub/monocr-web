<script lang="ts">
	import '../app.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/500.css';
	// @ts-expect-error virtual module
	import { pwaInfo } from 'virtual:pwa-info';

	// Import font files for preloading
	import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
	import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff2?url';

	import { onMount } from 'svelte';
	import { logger } from '$lib/logger';
	import { SEO, Header } from '$lib/components';
	import { initLanguage } from '$lib/i18n';

	const { children } = $props();

	onMount(async () => {
		try {
			initLanguage();
		} catch (error) {
			logger.error('lang init failed:', error);
		}

		if (pwaInfo) {
			// @ts-expect-error virtual module
			const { registerSW } = await import('virtual:pwa-register');

			// Use requestIdleCallback if available, otherwise fallback to setTimeout
			// This ensures SW registration doesn't block main thread during hydration/interactivity
			const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

			idleCallback(() => {
				registerSW({
					immediate: true,
					onRegisterError(error: unknown) {
						// Quietly fail in production, log only in dev if needed
						logger.error('SW registration error', error);
					}
				});
			});
		}
	});
</script>

<svelte:head>
	<!-- apply theme immediately to prevent flash -->
	<script>
		(function () {
			try {
				const savedTheme = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
				if (isDark) {
					document.documentElement.classList.add('dark');
				}
			} catch {
				// localStorage unavailable, fallback to css
			}
		})();
	</script>

	<!-- favicon -->
	<link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />

	<!-- preload critical fonts -->
	<link
		rel="preload"
		href={inter400}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>
	<link
		rel="preload"
		href={inter500}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
		fetchpriority="high"
	/>

	<!-- load manifest async -->
</svelte:head>

<Header />

<div
	class="selection:text-fg-on-primary min-h-screen bg-canvas text-fg-primary transition-colors duration-500 ease-in-out selection:bg-fg-accent"
	lang="en"
>
	<div class="mx-auto max-w-3xl px-6 py-8 sm:px-8 md:py-12 lg:px-8 lg:py-16">
		<a
			href="#main-content"
			class="focus:text-bg-canvas sr-only transition-all duration-200 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-fg-primary focus:px-4 focus:py-2"
		>
			Skip to main content
		</a>
		<SEO />
		{@render children?.()}
	</div>
</div>
