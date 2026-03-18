<script lang="ts">
	const { children } = $props();
</script>

<div class="mx-auto w-full max-w-7xl pt-16">
	{@render children?.()}
</div>
