import type { BaseListQuery } from "@/types/query/query.type";

export type PostCategoryListQuery = BaseListQuery & {
  name?: string;

  slug?: string;
};
