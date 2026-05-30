"use client";

import { X } from "lucide-react";

type Props = {
  filters: {
    categoryId?: number;
    carModelId?: number;
    name?: string;
    sortBy?: string;
  };

  locked?: {
    categoryId?: number;
    carModelId?: number;
  };

  onRemove: (next: any) => void;
};

export function ActiveFilterChips({ filters, locked, onRemove }: Props) {
  const chips: {
    key: string;
    label: string;
    removable: boolean;
    onRemove: () => void;
  }[] = [];

  // SEARCH
  if (filters.name) {
    chips.push({
      key: "name",
      label: `name: "${filters.name}"`,
      removable: true,
      onRemove: () => onRemove({ name: undefined }),
    });
  }

  // CATEGORY
  if (filters.categoryId) {
    chips.push({
      key: "category",
      label: "Category",
      removable: !locked?.categoryId,
      onRemove: () =>
        !locked?.categoryId && onRemove({ categoryId: undefined }),
    });
  }

  // CAR MODEL
  if (filters.carModelId) {
    chips.push({
      key: "carModel",
      label: "Car model",
      removable: !locked?.carModelId,
      onRemove: () =>
        !locked?.carModelId && onRemove({ carModelId: undefined }),
    });
  }

  // SORT
  if (filters.sortBy && filters.sortBy !== "newest") {
    chips.push({
      key: "sortBy",
      label: `sortBy: ${filters.sortBy}`,
      removable: true,
      onRemove: () => onRemove({ sortBy: undefined }),
    });
  }

  // RESET ALL
  const resetAll = () => {
    onRemove({
      name: undefined,
      categoryId: locked?.categoryId,
      carModelId: locked?.carModelId,
      sort: undefined,
    });
  };

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <div
          key={chip.key}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full"
        >
          <span>{chip.label}</span>

          {chip.removable && (
            <button onClick={chip.onRemove} className="hover:text-red-500">
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {/* RESET ALL */}
      <button
        onClick={resetAll}
        className="text-xs text-blue-600 hover:underline ml-2"
      >
        Reset all
      </button>
    </div>
  );
}
