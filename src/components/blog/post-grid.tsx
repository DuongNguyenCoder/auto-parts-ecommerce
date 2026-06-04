"use client";

import { cn } from "@/lib/utils";

import { PostCard } from "./post-card";

import type { PaginatedData, Post, PostCategoryListQuery } from "@/types";
// import { PostTest } from "@/types/post.type";

type Props = {
  posts: any[];
  className?: string;
};

export function PostGrid({ posts, className }: Props) {
  if (!posts.length) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
        <div className="space-y-1">
          <h3 className="text-sm font-medium">No posts found</h3>
          <p className="text-sm text-muted-foreground">
            There are no articles available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostGrid;
