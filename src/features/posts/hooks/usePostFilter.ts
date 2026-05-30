"use client";

import { PostListQuery } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useRef } from "react";

const toNumber = (value: string | null): number | undefined => {
  if (!value) return undefined;

  const num = Number(value);

  return Number.isNaN(num) ? undefined : num;
};

export function usePostFilters() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // stable filters object
  const searchParams = params.toString();

  const filters: PostListQuery = useMemo(
    () => ({
      title: params.get("title") ?? undefined,
      sortBy: (params.get("sortBy") as PostListQuery["sortBy"]) ?? undefined,
      orderBy: (params.get("orderBy") as PostListQuery["orderBy"]) ?? undefined,
      page: toNumber(params.get("page")),
    }),
    [searchParams],
  );

  const pushParams = (next: Partial<PostListQuery>) => {
    const newParams = new URLSearchParams(params.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    // reset pagination for any filter changes
    if (
      "title" in next ||
      "sortBy" in next ||
      "orderBy" in next ||
      "postCategoryId" in next ||
      "status" in next ||
      "authorId" in next
    ) {
      newParams.delete("page");
    }

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const setFilters = (next: Partial<PostListQuery>) => {
    // debounce only search
    if ("title" in next) {
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
