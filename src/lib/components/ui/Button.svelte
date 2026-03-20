<script lang="ts">
	interface Props {
		href: string;
		variant?: 'primary' | 'secondary';
		children: import('svelte').Snippet;
	}

	const { href, variant = 'primary', children }: Props = $props();

	const variantClass = $derived(
		variant === 'primary' ? 'btn-primary min-h-[36px] px-6' : 'btn-secondary min-h-[36px] px-5'
	);

	const ariaLabel = $derived(href.startsWith('mailto:') ? 'Send email' : undefined);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {href} class={variantClass} aria-label={ariaLabel}>
	{@render children()}
</a>
