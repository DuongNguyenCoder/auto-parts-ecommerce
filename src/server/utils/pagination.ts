import type { Pagination } from "@/types";

export const buildPagination = (
  total: number,
  take = 10,
  skip = 0,
): Pagination => {
  const effectiveTake = take || 10;
  const effectiveSkip = skip || 0;
  const page = Math.floor(effectiveSkip / effectiveTake) + 1;
  const totalPages = Math.max(1, Math.ceil(total / effectiveTake));
  const hasMore = effectiveSkip + effectiveTake < total;

  return {
    total,
    take: effectiveTake,
    skip: effectiveSkip,
    hasMore,
    page,
    totalPages,
  };
};
