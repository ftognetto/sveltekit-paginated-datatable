import { paginatedStateFromUrl, type PaginatedData } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const paginationState = paginatedStateFromUrl(event.url);

	const data = [];
	for (let i = 0; i < 10000; i++) {
		data.push({
			id: i,
			name: `Customer ${i}`
		});
	}
	const count = 10000;

	return {
		paginatedData: {
			data: data,
			count: count,
			state: paginationState
		} as PaginatedData<{ id: number; name: string }>
	};
};
