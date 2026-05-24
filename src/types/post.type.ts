import type { PostStatus } from "@/../prisma/generated/prisma";

import type { AuthUser } from "@/types/auth";
import type { Product } from "@/types/product.type";
import type { PostCategory } from "@/types/post-category.type";

export type Post = {
  id: number;

  title: string;
  slug: string;

  content: string;

  excerpt: string | null;
  thumbnail: string | null;

  status: PostStatus;

  publishedAt: string | null;

  metaTitle: string | null;
  metaDesc: string | null;

  authorId: string;
  author: Pick<AuthUser, "id" | "email" | "role">;

  postCategoryId: number | null;
  category: PostCategory | null;

  relatedProducts: Product[];

  createdAt: string;
  updatedAt: string;
};
