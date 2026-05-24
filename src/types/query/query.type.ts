export type SearchQuery = {
  search?: string;
};

export type PaginationQuery = {
  take?: number;
  skip?: number;
};

export type SortOrder = "asc" | "desc";

export type BaseListQuery = PaginationQuery & {
  sortBy?: string;
  orderBy?: SortOrder;
};
