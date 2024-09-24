export class PaginatedData<T> {
  page: number;

  pagesize: number;

  total: number;

  items: T[];
}
