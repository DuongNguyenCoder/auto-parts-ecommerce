import type { BaseListQuery } from "@/types/query/query.type";

export type BrandListQuery = BaseListQuery & {
  name?: string;
};
