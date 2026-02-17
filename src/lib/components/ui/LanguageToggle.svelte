<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { currentLanguage, switchLanguage, sourceLanguageTag } from '$lib/i18n';
	import { logger } from '$lib/logger';
	import { browser } from '$app/environment';

	interface Props {
		disabled?: boolean;
	}

	const { disabled = false }: Props = $props();

	// Ensure we have a default if store is empty
	let lang = $state(sourceLanguageTag);
	let unsubscribe: (() => void) | null = null;
	let languageChangeHandler: ((e: Event) => void) | null = null;

	onMount(() => {
		if (!browser) return;

		unsubscribe = currentLanguage.subscribe((value) => {
			lang = value;
		});

		languageChangeHandler = (e: Event) => {
			const customEvent = e as CustomEvent<{ lang: string }>;
			if (customEvent.detail?.lang) {
				lang = customEvent.detail.lang;
			}
		};

		window.addEventListener('languagechange', languageChangeHandler);
	});

	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}
		if (languageChangeHandler) {
			window.removeEventListener('languagechange', languageChangeHandler);
			languageChangeHandler = null;
		}
	});

	async function toggleLanguage(): Promise<void> {
		// Changed to async function
		if (!browser || disabled) return;

		try {
			const newLang = lang === 'en' ? 'mm' : 'en';
			await switchLanguage(newLang); // Added await
		} catch (error) {
			logger.error('Language toggle failed:', error); // Changed console.error to logger.error
		}
	}
</script>

<button
	onclick={toggleLanguage}
	class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-fg-secondary transition-all hover:bg-canvas-subtle hover:text-fg-primary focus:outline-none"
	aria-label="Change language (Current: {lang})"
	type="button"
	tabindex={disabled ? -1 : 0}
>
	<img
		src={lang === 'en' ? '/icons/en.svg' : '/icons/mm.svg'}
		alt={lang === 'en' ? 'English' : 'Burmese'}
		class="h-4 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
		width="16"
		height="16"
	/>
</button>
