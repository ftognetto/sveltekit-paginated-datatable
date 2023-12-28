type PaginatedDataPage = {
	name: string;
	href?: string;
	current: boolean;
};
type PaginatedDataPagination = {
	pages: PaginatedDataPage[];
	lastPage: number;
	showingFrom: number;
	showingTo: number;
};
export type PaginatedState = {
	page: number;
	limit: number;
	sort?: Record<string, 'asc' | 'desc'>;
	filters?: Record<string, any>;
};
export type PaginatedData<T> = {
	data: T[];
	count: number;
	state: PaginatedState;
	pagination: PaginatedDataPagination;
};

export const paginatedState = (url: URL): PaginatedState => {
	const page = Number.parseInt(url.searchParams.get('page') || '1');
	const limit = Number.parseInt(url.searchParams.get('limit') || '20');
	const sorts = url.searchParams.get('sort') || undefined;
	let sort: Record<string, 'asc' | 'desc'> = {};
	if (sorts) {
		const sortArray = sorts.split(',');
		sortArray.forEach((sortString) => {
			const sortKey = sortString.substring(1);
			const sortDirection = sortString[0] === '+' ? 'asc' : 'desc';
			sort[sortKey] = sortDirection;
		});
	}
	let filters: Record<string, any> = {};
	url.searchParams.forEach((value, key) => {
		if (
			key !== 'page' &&
			key !== 'limit' &&
			key !== 'sort' &&
			value !== '' &&
			value !== 'undefined' &&
			value !== 'null'
		) {
			if (!filters) {
				filters = {};
			}
			if (Array.isArray(filters[key])) {
				filters[key].push(value);
			} else {
				if (filters[key]) {
					filters[key] = [filters[key], value];
				} else {
					filters[key] = value;
				}
			}
		}
	});
	return {
		page,
		limit,
		sort,
		filters
	};
};

export const paginatedData = <T>(
	data: T[],
	count: number,
	state: PaginatedState
): PaginatedData<T> => {
	const pages = paginate(state, count);
	return {
		data,
		count,
		state,
		pagination: {
			pages,
			lastPage: Math.ceil(count / state.limit),
			showingFrom: (state.page - 1) * state.limit + 1,
			showingTo: Math.min(count, (state.page - 1) * state.limit + state.limit)
		}
	};
};

export type PaginatedLoadFunction<T> = (
	paginationState: PaginatedState
) => Promise<{ data: T[]; count: number }>;

export async function loadPaginatedData<T>(
	state: PaginatedState,
	loadFunction: PaginatedLoadFunction<T>
): Promise<PaginatedData<T>> {
	const { data, count } = await loadFunction(state);
	return { data, count, state } as PaginatedData<T>;
}

const paginate = (state: PaginatedState, count: number) => {
	const currentPage = state.page;
	const pageSize = state.limit;

	const pageCount = Math.floor(count / pageSize) + 1;

	const pages: PaginatedDataPage[] = [
		{
			current: currentPage === 1,
			name: '1',
			href: href(state, 1)
		}
	];

	if (currentPage === 1 && pageCount === 1) return pages;
	if (currentPage > 4)
		pages.push({
			current: false,
			name: '…'
		});

	let r = 2,
		r1 = currentPage - r,
		r2 = currentPage + r;

	for (let i = r1 > 2 ? r1 : 2; i <= Math.min(pageCount, r2); i++)
		pages.push({
			name: i.toString(),
			current: i === currentPage,
			href: href(state, i)
		});

	if (r2 + 1 < pageCount)
		pages.push({
			current: false,
			name: '…'
		});
	if (r2 < pageCount)
		pages.push({
			current: pageCount === currentPage,
			name: pageCount.toString(),
			href: href(state, pageCount)
		});

	return pages;
};

const href = (state: PaginatedState, page: number) => {
	let paginatedUrl = `page=${page}&limit=${state.limit}`;
	if (state.sort) {
		const sorts = Object.keys(state.sort).map(
			(key) => `${state.sort![key] === 'asc' ? '+' : '-'}${key}`
		);
		paginatedUrl += `&sort=${sorts.join(',')}`;
	}
	if (state.filters) {
		for (const key in state.filters) {
			paginatedUrl += `&${key}=${state.filters[key]}`;
		}
	}
	return paginatedUrl;
};
