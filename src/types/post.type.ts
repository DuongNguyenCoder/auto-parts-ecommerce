import { Prisma } from "@/../prisma/generated/prisma";

import type { AuthUser } from "@/types/auth";
import type { Product } from "@/types/product.type";
import type { PostCategory } from "@/types/post-category.type";
import { prisma } from "@/server/prisma";

// export type Post = {
//   id: number;

//   title: string;
//   slug: string;

//   content: string;

//   excerpt: string | null;
//   thumbnail: string | null;

//   status: PostStatus;

//   publishedAt: Date | null;

//   metaTitle: string | null;
//   metaDesc: string | null;

//   authorId: string;
//   author: Pick<AuthUser, "id" | "email" | "role">;

//   postCategoryId: number | null;
//   // category: PostCategory | null;

//   relatedProducts: Product[];

//   createdAt: Date;
//   updatedAt: Date;
// };

export const postSelect = Prisma.validator<Prisma.PostDefaultArgs>()({
  select: {
    id: true,
    title: true,
    slug: true,
    content: true,
    excerpt: true,
    thumbnail: true,
    status: true,
    publishedAt: true,
    metaTitle: true,
    metaDesc: true,
    authorId: true,

    author: {
      select: {
        id: true,
        email: true,
        role: true,
      },
    },

    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },

    postCategoryId: true,

    relatedProducts: {
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        categoryId: true,
        imageUrl: true,
      },
    },

    createdAt: true,
    updatedAt: true,
  },
});

export type Post = Prisma.PostGetPayload<typeof postSelect>;

// export type Post = Omit<RawPost, "relatedProducts"> & {
//   relatedProducts: (Omit<RawPost["relatedProducts"][number], "price"> & {
//     price: number;
//   })[];
// };

export type ProductToPost = Omit<Post["relatedProducts"][number], "price"> & {
  price: number;
};
