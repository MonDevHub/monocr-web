import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html',
			precompress: true,
			strict: true,
			pages: 'build',
			assets: 'build'
		}),
		alias: {
			'@/*': './src/lib/*'
		},
		inlineStyleThreshold: 40960, // Inline CSS smaller than 40kb to avoid render blocking
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: ['/', '/about', '/docs']
		}
	}
};

export default config;
