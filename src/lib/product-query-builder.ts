// lib/product-query-builder.ts

import { ProductListQuery } from "@/types";

export function buildProductQuery(
  filters: ProductListQuery,
  locked?: Partial<Pick<ProductListQuery, "categoryId" | "carModelId">>,
) {
  return {
    categoryId: locked?.categoryId ?? filters.categoryId,
    carModelId: locked?.carModelId ?? filters.carModelId,

    sort: filters.sortBy ?? "newest",
  };
}
