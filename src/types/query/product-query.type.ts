import type { BaseListQuery } from "@/types/query/query.type";

export type ProductSortField = "name" | "price" | "createdAt" | "updatedAt";
export const PRODUCT_SORT_FIELDS = [
  "name",
  "price",
  "createdAt",
  "updatedAt",
] as const;

export type ProductListQuery = BaseListQuery & {
  name?: string;

  slug?: string;

  categoryId?: number;

  brandId?: number;

  carModelId?: number;

  minPrice?: number;

  maxPrice?: number;
};
