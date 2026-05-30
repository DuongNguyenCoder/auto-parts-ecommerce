export type SearchQuery = {
  search?: string;
};

export type PaginationQuery = {
  take?: number;
  skip?: number;
  page?: number;
};

export type SortOrder = "asc" | "desc";

export type BaseListQuery<TSortField extends string = string> =
  PaginationQuery &
    SearchQuery & {
      sortBy?: TSortField;
      orderBy?: SortOrder;
    };
