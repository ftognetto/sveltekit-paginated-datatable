<script lang="ts">
	import { page } from '$app/stores';
	import { PaginatedUrl, type PaginatedData } from './paginated_data';

	export let paginatedData: PaginatedData<any>;
	export let paginationClass: string | undefined = undefined;
	$: currentPage = paginatedData.state.page;
	$: count = paginatedData.count;
	$: pageSize = paginatedData.state.limit;

	// function _handlePageChange(newPage: number) {
	// 	// dispatch('setPage', page);
	// 	paginatedData.state.page = newPage;
	// 	goto(`${$page.url.pathname}?${paginatedData.state.toPaginatedUrl()}`, { noScroll: true });
	// }
	const _href = (page: number) =>
		`${$page.url.pathname}?${PaginatedUrl.from({ ...paginatedData.state, page })}`;

	$: pageCount = Math.floor(count / pageSize) + 1;
	$: pages = paginate(currentPage, pageCount);

	const paginate = (current: number, max: number) => {
		let items: (number | string)[] = [1];

		if (current === 1 && max === 1) return items;
		if (current > 4) items.push('…');

		let r = 2,
			r1 = current - r,
			r2 = current + r;

		for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);

		if (r2 + 1 < max) items.push('…');
		if (r2 < max) items.push(max);

		return items;
	};
</script>

<nav class={paginationClass}>
	<a href={_href(currentPage - 1)} data-sveltekit-noscroll class:disabled={currentPage === 1}>
		<slot name="prev" {currentPage}>Previous</slot>
	</a>

	{#each pages as page}
		{#if typeof page === 'string'}
			<slot name="ellipsis">...</slot>
		{:else if page === currentPage}
			<a href={_href(page)} data-sveltekit-noscroll>
				<slot name="currentPage" {page}>
					{page}
				</slot>
			</a>
		{:else}
			<a href={_href(page)} data-sveltekit-noscroll>
				<slot name="page" {page}>
					{page}
				</slot>
			</a>
		{/if}
	{/each}

	<a
		href={_href(currentPage + 1)}
		data-sveltekit-noscroll
		class:disabled={currentPage === pageCount}
	>
		<slot name="next" {currentPage}>Next</slot>
	</a>
</nav>
