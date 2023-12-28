<script lang="ts">
	import type { PaginatedData } from '$lib';
	import PaginatedDatatable from '$lib/paginated_datatable.svelte';

	export let data;
	$: paginatedData = data.paginatedData;
	const paginationCountBuilder: (paginatedData: PaginatedData<any>) => string = (data) => {
		if (data.count > 0) {
			return `
			<p class="text-sm text-gray-700">
				Dal
				<span class="font-medium"
					>${(data.state.page - 1) * data.state.limit + 1}</span
				>
				al
				<span class="font-medium"
					>${Math.min(data.count, (data.state.page - 1) * data.state.limit + data.state.limit)}</span
				>
				di
				<span class="font-medium">${data.count}</span>
				risultati
			</p>`;
		}
		return '';
	};
</script>

<div class="mt-8 flow-root">
	<div class="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
		<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
			<PaginatedDatatable
				{paginatedData}
				ssr={true}
				columns={[
					{ name: 'id', cssClass: `px-3 py-3.5 text-left text-sm font-semibold text-gray-900` },
					{ name: 'Name', cssClass: `px-3 py-3.5 text-left text-sm font-semibold text-gray-900` }
				]}
				containerClass={!data.paginatedData.error && paginatedData.count > 0
					? 'overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg'
					: ''}
				tableClass="min-w-full divide-y divide-gray-300"
				theadClass="bg-gray-50"
				tbodyClass="divide-y divide-gray-200 bg-white"
				columnsClass="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
				paginationContainerClass="flex items-center justify-center sm:justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
				paginationClass="isolate inline-flex -space-x-px rounded-md shadow-sm"
				paginationCountClass="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
				{paginationCountBuilder}
				on:pageChange
			>
				<slot name="empty" slot="empty">
					<div class="text-center mt-8">
						<h3 class="mt-2 text-sm font-semibold text-gray-900">Nessun risultato</h3>
						<p class="mt-1 text-sm text-gray-500">
							Crea un oggetto o prova a cambiare i filtri di ricerca.
						</p>
					</div>
				</slot>

				<svelte:fragment slot="row" let:row let:index>
					{#if paginatedData.count}
						<slot
							name="row"
							{row}
							{index}
							tdClass="px-3 py-4 text-sm text-gray-500"
							trClass="hover:bg-gray-50"
						/>
					{/if}
				</svelte:fragment>

				<span
					slot="pagination-prev"
					class=" relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
				>
					<svg
						class="h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
				<span
					slot="pagination-next"
					class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
				>
					<svg
						class="h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
				<span
					slot="pagination-page"
					let:page
					class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>{page}</span
				>
				<span
					slot="pagination-currentPage"
					let:page
					class="relative z-10 inline-flex items-center border border-primary-500 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 focus:z-20"
				>
					{page}
				</span>
				<span
					slot="pagination-ellipsis"
					class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
					>...</span
				>
			</PaginatedDatatable>
		</div>
	</div>
</div>
