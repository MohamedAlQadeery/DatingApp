export interface IPagination {
  currentPage: Number;
  itemsPerPage: Number;
  totalPages: Number;
  totalItems: Number;
}

export class PaginatedResult<T> {
  result: any;
  pagination: IPagination;
}
