export class PaginatedDatatableShowOptions {
	header: boolean;
	limit: boolean;
	columnTitles: boolean;
	constructor({
		header = true,
		limit = true,
		columnTitles = true
	}: {
		header?: boolean;
		limit?: boolean;
		columnTitles?: boolean;
	} = {}) {
		this.header = header;
		this.limit = limit;
		this.columnTitles = columnTitles;
	}
}
