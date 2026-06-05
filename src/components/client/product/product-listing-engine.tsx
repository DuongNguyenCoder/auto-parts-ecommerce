"use client";

import { ProductFilterBar } from "@/components/client/product/product-filter-bar";
import { ProductGrid } from "@/components/client/product/produc-grid";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import { ActiveFilterChips } from "@/components/client/product/active-filter-chips";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { Product, Category } from "@/types";
import { useMemo } from "react";
import { PaginationCustom } from "@/components/ui/pagination-custom";

type InitialResponse = {
  items?: Product[];
  pagination?: {
    page?: number;
    totalpage?: number;
    total?: number;
    take?: number;
    skip?: number;
  };
};

type Props = {
  // full ApiResponse from productApi.getAll (to hydrate client)
  initialResponse?: InitialResponse;
  initialItems?: Product[];
  categories?: Category[];
  lockedCarModelId?: number;
};

export function ProductListingEngine({
  initialResponse,
  initialItems,
  categories,
  lockedCarModelId,
}: Props) {
  const { filters, setFilters } = useProductFilters();

  const locked = useMemo(
    () => ({ carModelId: lockedCarModelId }),
    [lockedCarModelId],
  );

  const initialResponseData = initialResponse?.items;

  const shouldHydrateWithInitialResponse =
    !filters.categoryId &&
    !filters.name &&
    !filters.sortBy &&
    !filters.orderBy &&
    !filters.page;

  const initialQueryData = shouldHydrateWithInitialResponse
    ? {
        success: true,
        message: "",
        data: initialResponseData,
        pagination: initialResponse?.pagination,
      }
    : undefined;

  const query = useProductsQuery(filters, locked, initialQueryData);

  const items =
    query?.data?.data?.items ?? initialResponseData ?? initialItems ?? [];

  const pagination = query.data?.data?.pagination ??
    initialResponse?.pagination ?? {
      page: 1,
      totalPages: 1,
      take: 10,
      skip: 0,
    };

  const currentPage = filters.page ?? pagination.page ?? 1;

  console.log(" pagination.totalpage ==> ", pagination.totalpage);
  console.log(" pagination.currentPage ==> ", query);
  return (
    <div className="flex flex-col gap-4">
      <ProductFilterBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />

      <ActiveFilterChips
        filters={filters}
        locked={{ carModelId: lockedCarModelId }}
        onRemove={setFilters}
      />

      <ProductGrid products={items} loading={query.isLoading} />

      <div className="mt-4">
        <PaginationCustom
          page={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setFilters({ page: p })}
        />
      </div>
    </div>
  );
}
