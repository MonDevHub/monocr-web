<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { getRecords, deleteRecord, clearHistory, type OCRRecord } from '$lib/storage/db';

	interface Props {
		category?: string;
		title?: string;
	}

	let { category = 'ocr-scan', title = 'Recent Scans' }: Props = $props();

	let historyRecords = $state<OCRRecord[]>([]);
	let selectedRecord = $state<OCRRecord | null>(null);
	let modalOpen = $state(false);
	let modalPreviewUrl = $state<string | null>(null);
	let loading = $state(false);
	let copied = $state(false);

	async function loadHistory() {
		try {
			loading = true;
			historyRecords = await getRecords(category);
		} catch (e) {
			console.error(`Failed to load history for ${category}:`, e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadHistory();
	});

	// Expose a method to refresh from outside if needed
	export function refresh() {
		loadHistory();
	}

	function viewRecord(record: OCRRecord) {
		selectedRecord = record;
		if (modalPreviewUrl) URL.revokeObjectURL(modalPreviewUrl);
		modalPreviewUrl = URL.createObjectURL(record.fileData);
		modalOpen = true;
	}

	function closeRecordView() {
		modalOpen = false;
		// Cleanup after transition
		setTimeout(() => {
			if (!modalOpen) {
				selectedRecord = null;
				if (modalPreviewUrl) {
					URL.revokeObjectURL(modalPreviewUrl);
					modalPreviewUrl = null;
				}
			}
		}, 300);
	}
</script>

{#if historyRecords.length > 0}
	<section class="mt-8 space-y-4" in:fade={{ duration: 150 }}>
		<div class="flex items-center justify-between">
			<h2 class="text-fg-primary font-bold tracking-tight text-[var(--text-title)]">
				{title}
				{#if loading}
					<span class="text-fg-muted ml-2 text-xs font-normal opacity-50">Updating...</span>
				{/if}
			</h2>
			<button
				onclick={async () => {
					if (confirm('Are you sure you want to permanently delete all scans in this category?')) {
						await clearHistory(category);
						await loadHistory();
					}
				}}
				class="text-fg-secondary text-[11px] font-bold tracking-wider uppercase transition-colors hover:text-red-500"
			>
				Clear All
			</button>
		</div>

		<div class="space-y-2">
			{#each historyRecords as record (record.id)}
				<div
					class="border-border bg-canvas-subtle hover:bg-canvas group relative flex items-center justify-between rounded-[var(--radius-md)] border px-3 py-1.5 transition-all duration-150 select-none"
				>
					<div class="flex min-w-0 items-center gap-3">
						<span class="material-symbols-outlined text-fg-muted text-[16px] opacity-40"
							>{record.fileType.includes('pdf') ? 'picture_as_pdf' : 'image'}</span
						>
						<div class="flex min-w-0 items-baseline gap-2">
							<span class="text-fg-primary truncate text-[13px] font-medium">{record.fileName}</span
							>
							<span class="text-fg-muted text-[10px] opacity-50"
								>{new Date(record.timestamp).toLocaleDateString()}</span
							>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<button
							onclick={() => viewRecord(record)}
							class="text-fg-muted hover:text-primary opacity-0 transition-all group-hover:opacity-100"
							aria-label="View record"
						>
							<span class="material-symbols-outlined text-[18px]">visibility</span>
						</button>
						<button
							onclick={async (e) => {
								e.stopPropagation();
								await deleteRecord(record.id);
								await loadHistory();
							}}
							class="text-fg-muted opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
							aria-label="Delete record"
						>
							<span class="material-symbols-outlined text-[18px]">delete</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

<!-- Modal View -->
{#if modalOpen && selectedRecord}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<div
			class="bg-canvas/60 absolute inset-0 backdrop-blur-md"
			onclick={closeRecordView}
			role="button"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && closeRecordView()}
		></div>

		<div
			class="bg-canvas border-border shadow-huge relative flex h-full max-h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-huge)] border"
			in:fly={{ y: 15, duration: 250, delay: 50 }}
		>
			<div
				class="border-border bg-canvas-subtle flex items-center justify-between border-b px-5 py-3"
			>
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-fg-muted text-[18px]"
						>{selectedRecord.fileType.includes('pdf') ? 'picture_as_pdf' : 'image'}</span
					>
					<h2 class="text-fg-primary text-[13px] font-bold tracking-tight">
						{selectedRecord.fileName}
					</h2>
				</div>
				<button
					onclick={closeRecordView}
					class="text-fg-secondary hover:text-fg-primary flex h-7 w-7 items-center justify-center rounded-full transition-colors"
					aria-label="Close view"
				>
					<span class="material-symbols-outlined text-[18px]">close</span>
				</button>
			</div>

			<!-- Modal Body -->
			<div class="flex flex-1 flex-col overflow-hidden lg:flex-row">
				<!-- Preview Panel -->
				<div
					class="border-border bg-canvas-subtle flex items-center justify-center border-b p-4 lg:w-1/2 lg:border-r lg:border-b-0"
				>
					<div class="relative flex h-full w-full items-center justify-center overflow-hidden">
						<img
							src={modalPreviewUrl}
							alt="History Record Preview"
							class="h-auto max-h-full w-auto max-w-full rounded-[var(--radius-md)] object-contain shadow-sm"
						/>
					</div>
				</div>

				<!-- Content Panel -->
				<div class="bg-canvas flex flex-1 flex-col overflow-hidden p-5 lg:w-1/2">
					<div class="border-border/40 mb-4 flex items-center justify-between border-b pb-2">
						<span class="text-fg-secondary text-[10px] font-bold tracking-widest uppercase"
							>Content</span
						>
						<div class="text-fg-muted font-mono text-[10px]">
							{selectedRecord.processingTime}ms
						</div>
					</div>
					<div class="flex-1 overflow-y-auto">
						<p
							class="font-mon text-fg-primary selection:bg-primary/20 leading-relaxed break-words whitespace-pre-wrap text-[var(--text-body)]"
						>
							{selectedRecord.text}
						</p>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="border-border bg-canvas-subtle flex justify-end gap-2 border-t px-5 py-3">
				<button
					class="btn-secondary px-4 py-1.5 text-[11px]"
					onclick={() => {
						navigator.clipboard.writeText(selectedRecord?.text || '');
						copied = true;
						setTimeout(() => (copied = false), 2000);
					}}
				>
					{copied ? 'Copied' : 'Copy Text'}
				</button>
				<button class="btn-primary px-4 py-1.5 text-[11px]" onclick={closeRecordView}>
					Done
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.font-mon {
		font-family: 'PyidaungSu', 'Myanmar Text', sans-serif;
	}
</style>
