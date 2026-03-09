<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	let isDragging = false;
	let inputElement: HTMLInputElement;

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			dispatch('file', e.dataTransfer.files[0]);
		}
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			dispatch('file', target.files[0]);
			// Reset the input so the same file can be selected again
			target.value = '';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			inputElement?.click();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<label
	class="border-border bg-canvas group relative flex min-h-[44px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ease-in-out
           {isDragging
		? 'scale-[1.02] border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
		: 'hover:bg-canvas-subtle hover:border-fg-secondary'}"
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
	tabindex="0"
	on:keydown={handleKeydown}
>
	<input
		bind:this={inputElement}
		type="file"
		class="sr-only"
		accept="image/png, image/jpeg, image/webp"
		on:change={handleFileInput}
	/>

	<div class="pointer-events-none flex flex-col items-center gap-4">
		<div
			class="bg-canvas-subtle text-fg-secondary group-hover:text-fg-primary rounded-full p-4 transition-transform duration-300 group-hover:scale-110"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-8 w-8"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
				/>
			</svg>
		</div>
		<div class="space-y-1">
			<p class="text-fg-primary text-lg font-medium">Upload an image</p>
			<p class="text-fg-secondary text-sm">Drag and drop or click to select</p>
		</div>
	</div>

	{#if isDragging}
		<div
			class="pointer-events-none absolute inset-0 rounded-xl bg-blue-500/10 dark:bg-blue-400/10"
			transition:fade
		></div>
	{/if}
</label>
