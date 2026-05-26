export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export type Pagination = {
  total: number;
  take: number;
  skip: number;
  hasMore: boolean;
  page: number;
  totalPages: number;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: Pagination;
};
