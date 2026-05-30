"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ApiResponse,
  Category,
  CategoryListQuery,
  PaginatedData,
} from "@/types";
import { categoryApi } from "@/features/api";
import { useQuery } from "@tanstack/react-query";

const SEARCH_CATEGORIES = [
  {
    label: "All Parts",
    value: "all",
  },
  {
    label: "Engine",
    value: "engine",
  },
  {
    label: "Brakes",
    value: "brakes",
  },
  {
    label: "Suspension",
    value: "suspension",
  },
  {
    label: "Lighting",
    value: "lighting",
  },
];

type SearchBarProps = {
  className?: string;
};

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<number | undefined>(undefined);

  const categoriesQuery = useQuery<ApiResponse<PaginatedData<Category>>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const query: CategoryListQuery = {
        take: 30,
        skip: 0,
      };
      return categoryApi.getAll(query);
    },
    gcTime: 1000 * 60 * 5,
  });

  const categories = categoriesQuery.data?.data?.items ?? [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("name", query.trim());
    }

    if (category !== undefined) {
      params.set("categoryId", String(category));
    }

    window.location.href = `/san-pham?${params.toString()}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        group
        flex h-12 w-full overflow-hidden rounded-2xl
        border border-border
        bg-card
        shadow-sm
        transition-all duration-200
        hover:border-primary/30
        focus-within:border-primary/50
        focus-within:ring-4
        focus-within:ring-primary/10
        ${className ?? ""}
      `}
      role="search"
      aria-label="Search auto parts"
    >
      {/* CATEGORY */}
      <div className="hidden sm:flex shrink-0 border-r border-border bg-muted/50">
        <select
          value={category ?? ""}
          onChange={(e) =>
            setCategory(e.target.value ? Number(e.target.value) : undefined)
          }
          className="
            h-full min-w-[150px]
            border-none bg-transparent
            px-4 text-sm font-medium
            text-foreground
            outline-none
            cursor-pointer
          "
          aria-label="Select category"
        >
          <option value="">Tất cả</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* INPUT */}
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên sản phẩm ..."
          className="
            h-full border-0 bg-transparent
            pl-4 pr-12 text-sm shadow-none
            focus-visible:ring-0
            md:text-base
          "
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100">
          <kbd className="hidden rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground lg:block">
            Enter
          </kbd>
        </div>
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        size="icon"
        className="
          h-full rounded-none rounded-r-2xl
          px-5
          bg-primary
          hover:bg-primary-hover
          text-primary-foreground
          transition-all duration-200
        "
        aria-label="Search"
      >
        <Search className="size-5" />
      </Button>
    </form>
  );
}
