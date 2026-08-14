import { prisma } from "../prisma";

const publicSelect = {
  id: true,
  name: true,
  slug: true,
  imageUrl: true,
  models: {
    select: {
      id: true,
      name: true,
      year: true,
      imageUrl: true,
      slug: true,
    },
  },
} as const;

export type BrandRecord = Awaited<ReturnType<typeof brandRepository.findById>>;

export const brandRepository = {
  findById: (id: number) =>
    prisma.brand.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findBySlug: (slug: string) =>
    prisma.brand.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findMany: (
    where?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.brand.findMany({
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
    prisma.brand.count({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
    }),

  create: (data: { name: string }) =>
    prisma.brand.create({
      data,
      select: publicSelect,
    }),

  update: (id: number, data: { name?: string }) =>
    prisma.brand.update({
      where: { id },
      data,
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.brand.delete({
      where: { id },
      select: publicSelect,
    }),
};
