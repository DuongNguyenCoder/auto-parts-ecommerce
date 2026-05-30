// filters/ProductFilterBar.tsx
"use client";
import { CarModel, Category, ProductListQuery } from "@/types";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  filters: ProductListQuery;

  categories?: Category[];
  carModels?: CarModel[];

  onChange: (value: Partial<ProductListQuery>) => void;
};

const SORT_OPTIONS = [
  {
    label: "Default",
    value: {
      sortBy: undefined,
      orderBy: undefined,
    },
  },
  {
    label: "Price: Low to High",
    value: {
      sortBy: "price",
      orderBy: "asc",
    },
  },
  {
    label: "Price: High to Low",
    value: {
      sortBy: "price",
      orderBy: "desc",
    },
  },
  {
    label: "Name: A → Z",
    value: {
      sortBy: "name",
      orderBy: "asc",
    },
  },
  {
    label: "Name: Z → A",
    value: {
      sortBy: "name",
      orderBy: "desc",
    },
  },
] as const;

export function ProductFilterBar({ filters, categories, onChange }: Props) {
  const [search, setSearch] = useState(filters.name ?? "");

  // sync khi back/forward browser
  useEffect(() => {
    setSearch(filters.name ?? "");
  }, [filters.name]);

  const selectedSortValue =
    filters.sortBy && filters.orderBy
      ? `${filters.sortBy}-${filters.orderBy}`
      : "";

  return (
    <div className="flex flex-col gap-2">
      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {/* <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="6" cy="6" r="4" />
            <path d="M9.5 9.5l3 3" />
          </svg> */}
          <input
            type="text"
            value={search ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              // update UI instantly
              setSearch(value);

              // update URL state
              onChange({ name: value });
            }}
            placeholder="Tìm sản phẩm..."
            className="
              w-full h-8 pl-8 pr-3 text-sm
              rounded-md border border-gray-200 bg-white
              placeholder:text-gray-400 text-gray-800
              focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
              dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200
              dark:focus:ring-gray-500 dark:focus:border-gray-500
              transition
            "
          />
        </div>

        {/* Separator */}
        <div
          className="hidden sm:block h-5 w-px bg-gray-200 dark:bg-gray-700 shrink-0"
          aria-hidden="true"
        />

        {/* Category */}
        <select
          value={filters.categoryId ?? ""}
          onChange={(e) =>
            onChange({
              categoryId: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="
            h-8 pl-2.5 pr-7 text-sm
            rounded-md border border-gray-200 bg-white text-gray-700
            focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
            dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300
            dark:focus:ring-gray-500 dark:focus:border-gray-500
            cursor-pointer transition
          "
          aria-label="Lọc theo danh mục"
        >
          <option value="">Danh mục phụ tùng</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={selectedSortValue}
          onChange={(e) => {
            const selected = SORT_OPTIONS.find(
              (item) =>
                `${item.value.sortBy}-${item.value.orderBy}` === e.target.value,
            );

            onChange({
              sortBy: selected?.value.sortBy,
              orderBy: selected?.value.orderBy,
            });
          }}
          className="
            h-8 pl-2.5 pr-7 text-sm
            rounded-md border border-gray-200 bg-white text-gray-700
            focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
            dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300
            dark:focus:ring-gray-500 dark:focus:border-gray-500
            cursor-pointer transition
          "
          aria-label="Sắp xếp theo"
        >
          <option value="">Mặc định</option>
          {SORT_OPTIONS.map((option) => (
            <option
              key={`${option.value.sortBy}-${option.value.orderBy}`}
              value={`${option.value.sortBy}-${option.value.orderBy}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
