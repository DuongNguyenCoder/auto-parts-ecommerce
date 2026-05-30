"use client";

import { Loader2 } from "lucide-react";

import { PostGrid } from "./post-grid";

import type { PostCategory } from "@/types";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { usePostsQuery } from "@/features/posts/hooks/usePostQuery";
import { useMemo, useState } from "react";

type Props = {
  postCategory: PostCategory;
  take?: number;
};

export function PostListSection({ postCategory, take = 8 }: Props) {
  const [page, setPage] = useState(1);

  const skip = useMemo(() => {
    return (page - 1) * take;
  }, [page, take]);

  const { data, isLoading, isFetching } = usePostsQuery(
    {
      take,
      skip,
    },
    {
      postCategoryId: postCategory.id,
    },
  );

  const posts = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
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

export default PostListSection;
