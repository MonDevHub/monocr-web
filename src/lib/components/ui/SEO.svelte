<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		title?: string;
		description?: string;
		keywords?: string;
		image?: string;
		type?: 'website' | 'article' | 'profile';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		jsonLd?: Record<string, any>;
	}

	const {
		title = 'SvelteKit Template',
		description = 'A robust SvelteKit starter template.',
		keywords = 'SvelteKit, Template, Starter, Web Development',
		image = '/og-image.png',
		type = 'website',
		jsonLd = undefined
	}: Props = $props();

	const siteUrl = 'https://example.com';
	const canonicalUrl = $derived(`${siteUrl}${$page.url.pathname}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${siteUrl}${image}`);

	const defaultJsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': 'https://example.com/#website',
				url: 'https://example.com',
				name: 'SvelteKit Template',
				description: 'A robust SvelteKit starter template.',
				publisher: {
					'@id': 'https://example.com/#organization'
				},
				inLanguage: 'en-US'
			},
			{
				'@type': 'Organization',
				'@id': 'https://example.com/#organization',
				name: 'Organization Name',
				url: siteUrl,
				logo: {
					'@type': 'ImageObject',
					url: `${siteUrl}/logo.png`,
					width: 512,
					height: 512
				},
				email: 'contact@example.com'
			}
		]
	};

	const finalJsonLd = $derived(jsonLd || defaultJsonLd);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta name="author" content="Organization Name" />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={title} />
	<meta property="og:site_name" content="Site Name" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- Structured Data -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${JSON.stringify(finalJsonLd)}</` + `script>`}
</svelte:head>
