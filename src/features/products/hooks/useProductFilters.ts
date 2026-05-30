"use client";

import { ProductListQuery } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useRef } from "react";

const toNumber = (value: string | null): number | undefined => {
  if (!value) return undefined;

  const num = Number(value);

  return Number.isNaN(num) ? undefined : num;
};

export function useProductFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // stable filters object
  const filters: ProductListQuery = useMemo(
    () => ({
      categoryId: toNumber(params.get("categoryId")),

      carModelId: toNumber(params.get("carModelId")),

      name: params.get("name") ?? undefined,

      sortBy: (params.get("sort") as ProductListQuery["orderBy"]) ?? "newest",

      page: toNumber(params.get("page")),
    }),
    [params],
  );

  const pushParams = (next: Partial<ProductListQuery>) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // reset pagination
    if (
      "categoryId" in next ||
      "carModelId" in next ||
      "name" in next ||
      "orderBy" in next
    ) {
      newParams.delete("page");
    }

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const setFilters = (next: Partial<ProductListQuery>) => {
    // debounce only search
    if ("name" in next) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        pushParams(next);
      }, 400);

      return;
    }

    // category/sort push immediately
    pushParams(next);
  };

  return {
    filters,
    setFilters,
  };
}
