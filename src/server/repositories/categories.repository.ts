import { prisma } from "@/server/prisma";

const publicSelect = {
  id: true,
  name: true,
  slug: true,
} as const;

export type CategoryRecord = Awaited<
  ReturnType<typeof categoryRepository.findById>
>;

export const categoryRepository = {
  findById: (id: number) =>
    prisma.category.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findBySlug: (slug: string) =>
    prisma.category.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findMany: (
    where?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.category.findMany({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      // orderBy: { createdAt: "desc" },
    }),

  create: (data: { name: string; slug: string }) =>
    prisma.category.create({
      data,
      select: publicSelect,
    }),

  update: (id: number, data: { name?: string; slug?: string }) =>
    prisma.category.update({
      where: { id },
      data,
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.category.delete({
      where: { id },
      select: publicSelect,
    }),
};
