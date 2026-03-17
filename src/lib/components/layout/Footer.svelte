<script lang="ts">
	import { m } from '$lib/i18n';
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<footer class="text-fg-secondary mt-auto py-12 text-center text-sm">
	<div class="mx-auto max-w-4xl space-y-6">
		<p class="font-medium opacity-80">
			{m.footer_tagline()}
		</p>
		<p class="text-xs opacity-60">
			{m.footer_copy({ year: new Date().getFullYear().toString() })}
		</p>
		<p class="text-[10px] opacity-40">
			{m.footer_tech({ ocrs: 'MobileNetV3+BiLSTM', onnx: 'ONNX Runtime Web' })}
		</p>
	</div>
</footer>
