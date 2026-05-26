import { prisma } from "@/server/prisma";

const publicSelect = {
  id: true,
  name: true,
  slug: true,
} as const;

export type PostCategoryRecord = Awaited<
  ReturnType<typeof postCategoryRepository.findById>
>;

export const postCategoryRepository = {
  findById: (id: number) =>
    prisma.postCategory.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findBySlug: (slug: string) =>
    prisma.postCategory.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findMany: (
    where?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.postCategory.findMany({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { name: "asc" },
    }),

  count: (where?: { name?: string }) =>
    prisma.postCategory.count({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
    }),

  create: (data: { name: string; slug: string }) =>
    prisma.postCategory.create({
      data,
      select: publicSelect,
    }),

  update: (id: number, data: { name?: string; slug?: string }) =>
    prisma.postCategory.update({
      where: { id },
      data,
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.postCategory.delete({
      where: { id },
      select: publicSelect,
    }),
};
