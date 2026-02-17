import * as runtime from '$lib/paraglide/runtime.js';
import { writable } from 'svelte/store';
import { logger } from '$lib/logger';
import { browser } from '$app/environment';

// Map runtime exports to consistent names
export const sourceLanguageTag = runtime.baseLocale;
export const availableLanguageTags = runtime.locales;

export type AvailableLanguageTag = (typeof runtime.locales)[number];
export type Locale = AvailableLanguageTag;

// Create a Svelte store to track the current language
// Initialize with sourceLanguageTag, but update it potentially in init
export const currentLang = writable<AvailableLanguageTag>(sourceLanguageTag);
// Alias for backward compatibility
export const currentLanguage = currentLang;

// Initialize functionality
export const initLanguage = () => {
	if (!browser) return;

	try {
		// Paraglide's runtime usually handles initial detection if configured,
		// but we sync our store to it.
		// If runtime.getLocale is available:
		const detected = runtime.getLocale() as AvailableLanguageTag;
		if (availableLanguageTags.includes(detected)) {
			currentLang.set(detected);
		} else {
			currentLang.set(sourceLanguageTag);
		}
	} catch (error) {
		logger.error('lang init failed:', error);
	}
};

// Function to switch language manually
export const switchLanguage = async (lang: string) => {
	try {
		if (!availableLanguageTags.includes(lang as AvailableLanguageTag)) {
			logger.warn(`invalid locale: ${lang}, using ${sourceLanguageTag}`);
			return;
		}

		const newLang = lang as AvailableLanguageTag;

		// Update runtime
		// runtime.setLocale might be async or sync depending on config, but usually sync/async agnostic
		// generated runtime says: export let setLocale = (newLocale, options) => { ... }
		await runtime.setLocale(newLang);

		// Update store
		currentLang.set(newLang);

		// Dispatch event for legacy listeners if any
		if (browser) {
			window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: newLang } }));
		}
	} catch (error) {
		logger.error('lang switch failed:', error);
	}
};
