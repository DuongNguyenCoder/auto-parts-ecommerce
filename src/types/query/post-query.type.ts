import type { PostStatus } from "@/../prisma/generated/prisma";
import type { BaseListQuery } from "@/types/query/query.type";

export type PostSortField = "title" | "createdAt" | "updatedAt";
export const POST_SORT_FIELDS = ["title", "createdAt", "updatedAt"] as const;
export type PostListQuery = BaseListQuery<PostSortField> & {
  title?: string;

  slug?: string;

  status?: PostStatus;

  authorId?: string;

  postCategoryId?: number;

  relatedProductId?: number;

  publishedFrom?: string;

  publishedTo?: string;
};
