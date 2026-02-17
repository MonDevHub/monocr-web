<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	let isDragging = false;

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
		}
	}
</script>

<div
	class="group relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ease-in-out
           {isDragging
		? 'border-primary-500 bg-primary-50/10 scale-[1.02]'
		: 'hover:border-primary-400 border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50'}"
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
	role="button"
	tabindex="0"
	on:keypress={() => document.getElementById('fileInput')?.click()}
	on:click={() => document.getElementById('fileInput')?.click()}
>
	<input type="file" id="fileInput" class="hidden" accept="image/*" on:change={handleFileInput} />

	<div class="pointer-events-none flex flex-col items-center gap-4">
		<div
			class="group-hover:text-primary-500 rounded-full bg-slate-100 p-4 text-slate-500 transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800 dark:text-slate-400"
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
			<p class="text-lg font-medium text-slate-700 dark:text-slate-200">Upload an image</p>
			<p class="text-sm text-slate-500 dark:text-slate-400">Drag and drop or click to select</p>
		</div>
	</div>

	{#if isDragging}
		<div
			class="bg-primary-500/10 pointer-events-none absolute inset-0 rounded-xl"
			transition:fade
		></div>
	{/if}
</div>
