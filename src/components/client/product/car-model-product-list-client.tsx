"use client";

import { useMemo } from "react";
import type { CarModel } from "@/types";
import { useProductFilters } from "@/features/products/hooks/useProductFilters";
import { useProductsQuery } from "@/features/products/hooks/useProductsQuery";
import { ProductGrid } from "./produc-grid";
import { PaginationCustom } from "@/components/ui/pagination-custom";

type Props = {
  model: CarModel;
  initialResponse?: any;
  initialItems?: any[];
};

export function CarModelProductListClient({
  model,
  initialResponse,
  initialItems,
}: Props) {
  const { filters, setFilters } = useProductFilters();

  const locked = useMemo(() => ({ carModelId: model.id }), [model.id]);

  const query = useProductsQuery(filters, locked, initialResponse);

  const items = query.data?.data ?? initialItems ?? [];
  const pagination = query.data?.pagination ??
    initialResponse?.pagination ?? {
      page: 1,
      totalpage: 1,
      take: 12,
      skip: 0,
    };

  const currentPage = filters.page ?? pagination.page ?? 1;
  const totalPages = pagination.totalpage ?? 1;

  // Only render if we have items or are loading
  if (!query.isLoading && items.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      {/* Model heading */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="block h-5 w-1 rounded-full bg-foreground" />
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold tracking-tight text-foreground">
            {model.name}
          </h3>
        </div>
        <div className="flex-1 h-px bg-border/50" />
        {!query.isLoading && items.length > 0 && (
          <span className="text-sm text-muted-foreground shrink-0">
            {items.length} sản phẩm
          </span>
        )}
      </div>

      {/* Product grid */}
      <ProductGrid products={items} loading={query.isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <PaginationCustom
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setFilters({ page: p })}
          />
        </div>
      )}
    </section>
  );
}
