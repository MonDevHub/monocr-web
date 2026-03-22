<script lang="ts">
	import { m } from '$lib/i18n';
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer class="text-fg-secondary mt-auto py-12 text-center text-sm md:py-20 lg:py-24">
	<div class="mx-auto max-w-4xl space-y-2">
		<nav
			class="flex justify-center space-x-4 text-[10px] font-medium tracking-wide uppercase opacity-50"
		>
			<a href="/privacy" class="hover:text-fg-primary transition-colors">{m.footer_privacy()}</a>
			<a href="/docs" class="hover:text-fg-primary transition-colors">{m.nav_docs()}</a>
		</nav>
		<p class="text-xs opacity-60">
			{m.footer_copy({ year: new Date().getFullYear().toString() })}
		</p>
		<p class="text-[10px] opacity-40">
			{m.footer_tech({ ocrs: 'MobileNetV3+BiLSTM', onnx: 'ONNX Runtime Web' })}
		</p>
	</div>
</footer>
