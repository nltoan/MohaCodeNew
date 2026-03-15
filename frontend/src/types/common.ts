export type PaginationState<T> = {
  data: T[];
  activePage: number;
  totalPages: number;
  pageSize: number;
};
