import type { PostStatus } from "@/../prisma/generated/prisma";
import type { BaseListQuery } from "@/types/query/query.type";

export type PostListQuery = BaseListQuery & {
  title?: string;

  slug?: string;

  status?: PostStatus;

  authorId?: string;

  postCategoryId?: number;

  relatedProductId?: number;

  publishedFrom?: string;

  publishedTo?: string;
};
