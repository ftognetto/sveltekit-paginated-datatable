<script lang="ts">
	import type { PaginatedData } from './paginated_data';
	import PaginatedDatatablePagination from './paginated_datatable_pagination.svelte';
	import { PaginatedDatatableShowOptions } from './paginated_datatable_show_options';

	interface $$Slots {
		row: { row: T; index: number };
		empty: {};
		header: { paginatedData: PaginatedData<T> };
		error: { error?: string };
		thead: {};
		pagination: { paginatedData: PaginatedData<T> };
		'pagination-prev': {};
		'pagination-next': {};
		'pagination-count': {};
		'pagination-ellipsis': {};
		'pagination-page': { page: string | number };
		'pagination-currentPage': { page: string | number };
		footer: { paginatedData: PaginatedData<T> };
	}

	// Exported variables
	type T = $$Generic;
	export let paginatedData: PaginatedData<T>;
	export let showOptions: PaginatedDatatableShowOptions = new PaginatedDatatableShowOptions();
	export let columns: { name: string; cssClass?: string }[] = [];

	export let containerClass: string | undefined = undefined;
	export let tableClass: string | undefined = undefined;
	export let theadClass: string | undefined = undefined;
	export let columnsClass: string | undefined = undefined;
	export let tbodyClass: string | undefined = undefined;
	export let paginationContainerClass: string | undefined = undefined;
	export let paginationClass: string | undefined = undefined;
	export let paginationCountClass: string | undefined = undefined;
	export let paginationCountBuilder: (paginatedData: PaginatedData<T>) => string = (
		paginatedData
	) =>
		`Showing ${(paginatedData.state.page - 1) * paginatedData.state.limit + 1} to ${Math.min(
			paginatedData.count,
			(paginatedData.state.page - 1) * paginatedData.state.limit + paginatedData.state.limit
		)} of ${paginatedData.count} results`;
	export let ssr = true;
</script>

<div class={containerClass}>
	<slot name="header" {paginatedData} />
	{#if paginatedData.error}
		<slot name="error" error={paginatedData.error}>
			<tr>
				<td colspan="100" class="p-0 m-0">
					<div class="alert alert-danger rounded-0 m-0" role="alert">
						Si è verificato un'errore
						<br /><small class="text-muted">{paginatedData.error}</small>
					</div>
				</td>
			</tr>
		</slot>
	{:else if paginatedData.count === 0}
		<slot name="empty">
			<tr>
				<td colspan="100" class=" text-center">
					<div class="alert alert-light rounded-0 m-0" role="alert">Nessun risultato trovato</div>
				</td>
			</tr>
		</slot>
	{:else}
		<table class={tableClass}>
			<!-- head -->
			{#if showOptions.columnTitles}
				<slot name="thead">
					<thead class={theadClass}>
						<tr>
							{#each columns as column}
								<th scope="col" class={columnsClass + ' ' + column.cssClass}>{column.name}</th>
							{/each}
						</tr>
					</thead>
				</slot>
			{/if}
			<tbody class={tbodyClass}>
				{#each paginatedData.data as row, index (row)}
					<slot name="row" {row} {index} />
				{/each}
			</tbody>
		</table>

		<slot name="pagination" {paginatedData}>
			<div class={paginationContainerClass}>
				<div class={paginationCountClass}>
					{#if paginatedData.count >= 0}{@html paginationCountBuilder(paginatedData)}{/if}
				</div>

				<PaginatedDatatablePagination {paginatedData} {paginationClass} {ssr} on:pageChange>
					<slot name="pagination-prev" slot="prev" />
					<slot name="pagination-ellipsis" slot="ellipsis" />
					<slot name="pagination-next" slot="next" />
					<slot name="pagination-page" slot="page" let:page {page} />
					<slot name="pagination-currentPage" slot="currentPage" let:page {page} />
				</PaginatedDatatablePagination>
			</div>
		</slot>
	{/if}

	<slot name="footer" {paginatedData} />
</div>
