"use client";

import { Loader2 } from "lucide-react";

import { PostGrid } from "./post-grid";
import { PostFilterEngine } from "./post-filter-engine";

import type { PostCategory, PostListQuery } from "@/types";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { usePostsQuery } from "@/features/posts/hooks/usePostQuery";
import { usePostFilters } from "@/features/posts/hooks/usePostFilter";

type Props = {
  postCategory: PostCategory;
  take?: number;
  filterShow?: boolean;
};

export function PostListFilter({
  postCategory,
  take = 8,
  filterShow = true,
}: Props) {
  const { filters, setFilters } = usePostFilters();

  const handleSearch = (value: string) => {
    setFilters({ title: value || undefined });
  };

  const handleSortChange = (sortBy: string, orderBy: string) => {
    setFilters({
      sortBy: sortBy as PostListQuery["sortBy"],
      orderBy: orderBy as PostListQuery["orderBy"],
    });
  };

  console.log("Filter Change => ", filters);

  const skip = ((filters.page ?? 1) - 1) * take;

  const { data, isLoading, isFetching } = usePostsQuery(
    {
      ...filters,
      take,
      skip,
    },
    {
      postCategoryId: postCategory.id,
    },
  );

  const posts = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  console.log("Check query not engine: ", data);

  const handlePageChange = (nextPage: number) => {
    setFilters({ page: nextPage });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-center">
            {postCategory.name}
          </h2>

          <p className="text-sm text-muted-foreground text-center">
            Bài viết về {postCategory.name.toLowerCase()}.
          </p>
        </div>

        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {filterShow && (
        <PostFilterEngine
          defaultSearch={filters.title ?? ""}
          defaultSort={`${filters.sortBy ?? "publishedAt"}-${filters.orderBy ?? "desc"}`}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
        />
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-75 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <PostGrid posts={posts} />
      )}

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <PaginationCustom
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          className="pt-2"
        />
      )}
    </section>
  );
}

export default PostListFilter;
