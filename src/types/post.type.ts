import type { PostStatus } from "@/../prisma/generated/prisma";

import type { AuthUser } from "@/types/auth";
import type { Product } from "@/types/product.type";
import type { PostCategory } from "@/types/post-category.type";

export type Post = {
  id: number;

  title: string;
  slug: string;

  content: string;

  excerpt: string | undefined;
  thumbnail: string | undefined;

  status: PostStatus;

  publishedAt: string | undefined;

  metaTitle: string | undefined;
  metaDesc: string | undefined;

  authorId: string;
  author: Pick<AuthUser, "id" | "email" | "role">;

  postCategoryId: number | undefined;
  category: PostCategory | undefined;

  relatedProducts: Product[];

  createdAt: string;
  updatedAt: string;
};
