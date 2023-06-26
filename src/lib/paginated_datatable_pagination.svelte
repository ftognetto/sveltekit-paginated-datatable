<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { PaginatedUrl, type PaginatedData } from './paginated_data';

	export let paginatedData: PaginatedData<any>;
	export let paginationClass: string | undefined = undefined;
	export let paginationItemClass: string | undefined = undefined;
	export let paginationItemActiveClass: string | undefined = undefined;
	export let ssr = true;
	const dispatch = createEventDispatcher<{
		pageChange: { page: number };
	}>();

	$: currentPage = paginatedData.state.page;
	$: count = paginatedData.count;
	$: pageSize = paginatedData.state.limit;

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

{#if ssr}
	<!-- if ssr using <a> tag for using prefetch -->
	<nav class={paginationClass}>
		<a
			href={_href(currentPage - 1)}
			data-sveltekit-noscroll
			class={paginationItemClass}
			class:disabled={currentPage === 1}
		>
			<slot name="prev" {currentPage}>Previous</slot>
		</a>

		{#each pages as page}
			{#if typeof page === 'string'}
				<slot name="ellipsis">...</slot>
			{:else if page === currentPage}
				<a
					href={_href(page)}
					class="{paginationItemClass} {paginationItemActiveClass}"
					data-sveltekit-noscroll
				>
					<slot name="currentPage" {page}>
						{page}
					</slot>
				</a>
			{:else}
				<a href={_href(page)} class={paginationItemClass} data-sveltekit-noscroll>
					<slot name="page" {page}>
						{page}
					</slot>
				</a>
			{/if}
		{/each}

		<a
			href={_href(currentPage + 1)}
			class={paginationItemClass}
			data-sveltekit-noscroll
			class:disabled={currentPage === pageCount}
		>
			<slot name="next" {currentPage}>Next</slot>
		</a>
	</nav>
{:else}
	<!-- if not ssr emit events instead of navigate -->
	<nav class={paginationClass}>
		<button
			type="button"
			on:click={() => dispatch('pageChange', { page: currentPage - 1 })}
			class={paginationItemClass}
			class:disabled={currentPage === 1}
		>
			<slot name="prev" {currentPage}>Previous</slot>
		</button>

		{#each pages as page}
			{#if typeof page === 'string'}
				<slot name="ellipsis">...</slot>
			{:else if page === currentPage}
				<button
					type="button"
					on:click={() => dispatch('pageChange', { page: Number.parseInt(`${page}`) })}
					class="{paginationItemClass} {paginationItemActiveClass}"
					data-sveltekit-noscroll
				>
					<slot name="currentPage" {page}>
						{page}
					</slot>
				</button>
			{:else}
				<button
					type="button"
					on:click={() => dispatch('pageChange', { page: Number.parseInt(`${page}`) })}
					class={paginationItemClass}
					data-sveltekit-noscroll
				>
					<slot name="page" {page}>
						{page}
					</slot>
				</button>
			{/if}
		{/each}

		<button
			type="button"
			on:click={() => dispatch('pageChange', { page: currentPage + 1 })}
			class={paginationItemClass}
			data-sveltekit-noscroll
			class:disabled={currentPage === pageCount}
		>
			<slot name="next" {currentPage}>Next</slot>
		</button>
	</nav>
{/if}
