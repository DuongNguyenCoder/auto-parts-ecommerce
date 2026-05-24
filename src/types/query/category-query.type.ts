import type { BaseListQuery } from "@/types/query/query.type";

export type CategoryListQuery = BaseListQuery & {
  name?: string;

  slug?: string;
};
