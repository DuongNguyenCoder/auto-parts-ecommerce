import type { BaseListQuery } from "@/types/query/query.type";

export type ProductListQuery = BaseListQuery & {
  name?: string;

  slug?: string;

  categoryId?: number;

  brandId?: number;

  carModelId?: number;

  minPrice?: number;

  maxPrice?: number;
};
