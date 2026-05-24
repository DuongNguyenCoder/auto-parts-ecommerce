import { prisma } from "@/server/prisma";
import type { PostStatus } from "../../../prisma/generated/prisma/client";

const publicSelect = {
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
  postCategoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  relatedProducts: {
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      categoryId: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

type PostWriteData = {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  excerpt?: string;
  thumbnail?: string;
  status?: PostStatus;
  publishedAt?: Date;
  metaTitle?: string;
  metaDesc?: string;
  postCategoryId?: number;
  relatedProductIds?: number[];
};

type PostUpdateData = Partial<Omit<PostWriteData, "authorId">>;

const toPostCreateData = (data: PostWriteData) => {
  const { relatedProductIds, ...postData } = data;

  return {
    ...postData,
    relatedProducts: relatedProductIds
      ? {
          connect: relatedProductIds.map((id) => ({ id })),
        }
      : undefined,
  };
};

const toPostUpdateData = (data: PostUpdateData) => {
  const { relatedProductIds, ...postData } = data;

  return {
    ...postData,
    relatedProducts: relatedProductIds
      ? {
          set: relatedProductIds.map((id) => ({ id })),
        }
      : undefined,
  };
};

export type PostRecord = Awaited<ReturnType<typeof postRepository.findBySlug>>;

export const postRepository = {
  findBySlug: (slug: string) =>
    prisma.post.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findMany: (
    where?: {
      title?: string;
      status?: PostStatus;
      postCategoryId?: number;
      authorId?: string;
    },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.post.findMany({
      where: {
        title: where?.title
          ? { contains: where.title, mode: "insensitive" }
          : undefined,
        status: where?.status,
        postCategoryId: where?.postCategoryId,
        authorId: where?.authorId,
      },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { createdAt: "desc" },
    }),

  create: (data: PostWriteData) =>
    prisma.post.create({
      data: toPostCreateData(data),
      select: publicSelect,
    }),

  update: (slug: string, data: PostUpdateData) =>
    prisma.post.update({
      where: { slug },
      data: toPostUpdateData(data),
      select: publicSelect,
    }),

  delete: (slug: string) =>
    prisma.post.delete({
      where: { slug },
      select: publicSelect,
    }),
};
