export interface PaginatedResult<T> {
  page: number;
  pages: number;
  countItems: number;
  entities: T[];
}