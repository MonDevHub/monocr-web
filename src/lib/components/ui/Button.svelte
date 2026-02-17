<script lang="ts">
	interface Props {
		href: string;
		variant?: 'primary' | 'secondary';
		children: import('svelte').Snippet;
	}

	const { href, variant = 'primary', children }: Props = $props();

	const variantClass = $derived(
		variant === 'primary'
			? 'min-h-[44px] px-6 py-3 font-medium text-fg-on-primary rounded-lg shadow-md transition-all duration-300 transform bg-fg-accent hover:bg-fg-accent/90 hover:scale-[1.02] active:scale-[0.98] touch-manipulation focus:outline-none focus:ring-2 focus:ring-fg-accent focus:ring-offset-2'
			: 'min-h-[44px] px-6 py-3 font-medium rounded-lg transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-fg-accent focus:ring-offset-2'
	);

	const ariaLabel = $derived(href.startsWith('mailto:') ? 'Send email' : undefined);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class={variantClass} aria-label={ariaLabel}>
	{@render children()}
</a>
