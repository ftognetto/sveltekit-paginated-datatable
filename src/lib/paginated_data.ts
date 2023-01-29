export class PaginatedUrl {
	static from(state: PaginatedState): string {
		let paginatedUrl = `page=${state.page}&limit=${state.limit}`;
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
	}
	static toState(url: URL): PaginatedState {
		debugger;
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
		let filters: Record<string, any> | undefined = undefined;
		url.searchParams.forEach((value, key) => {
			if (key !== 'page' && key !== 'limit' && key !== 'sort' && value !== '') {
				if (!filters) {
					filters = {};
				}
				filters[key] = value;
			}
		});
		return {
			page,
			limit,
			sort: sorts ? sort : undefined,
			filters: filters
		};
	}
}
export interface PaginatedState {
	page: number;
	limit: number;
	sort?: Record<string, 'asc' | 'desc'>;
	filters?: Record<string, any>;
}

export interface PaginatedData<T> {
	data: T[];
	count: number;
	error?: string;
	state: PaginatedState;
}

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
