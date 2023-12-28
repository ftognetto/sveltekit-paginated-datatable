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
	export let paginationItemClass: string | undefined = undefined;
	export let paginationItemActiveClass: string | undefined = undefined;
	export let paginationCountBuilder: (paginatedData: PaginatedData<T>) => string = (
		paginatedData
	) =>
		`Showing ${paginatedData.pagination.showingFrom} to ${paginatedData.pagination.showingTo} of ${paginatedData.count} results`;
	export let ssr = true;
</script>

<div class={containerClass}>
	<slot name="header" {paginatedData} />
	{#if paginatedData.count === 0}
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

				<PaginatedDatatablePagination
					{paginatedData}
					{paginationClass}
					{paginationItemClass}
					{paginationItemActiveClass}
					{ssr}
					on:pageChange
				>
					<slot name="pagination-prev" slot="prev" />
					<slot name="pagination-ellipsis" slot="ellipsis" />
					<slot name="pagination-next" slot="next" />
					<svelte:fragment slot="page" let:page>
						<slot name="pagination-page" {page} />
					</svelte:fragment>
					<svelte:fragment slot="currentPage" let:page>
						<slot name="pagination-currentPage" {page} />
					</svelte:fragment>
				</PaginatedDatatablePagination>
			</div>
		</slot>
	{/if}

	<slot name="footer" {paginatedData} />
</div>
