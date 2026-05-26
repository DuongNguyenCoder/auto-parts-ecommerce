"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

type PaginationCustomProps = {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

export function PaginationCustom({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationCustomProps) {
  const createPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push("start-ellipsis");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("end-ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = createPages();

  const handleChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    onPageChange?.(newPage);
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <button
            onClick={() => handleChange(page - 1)}
            disabled={page === 1}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm transition-colors",
              page === 1 ? "pointer-events-none opacity-50" : "hover:bg-muted",
            )}
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>
        </PaginationItem>

        {/* Pages */}
        {pages.map((item, index) => {
          if (typeof item === "string") {
            return (
              <PaginationItem key={item + index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={page === item}
                onClick={() => handleChange(item)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next */}
        <PaginationItem>
          <button
            onClick={() => handleChange(page + 1)}
            disabled={page === totalPages}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-md border px-3 text-sm transition-colors",
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-muted",
            )}
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
