import { prisma } from "../prisma";

const publicSelect = {
  id: true,
  brandId: true,
  brand: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  // products: {
  //   select: {
  //     id: true,
  //     name: true,
  //     slug: true,
  //     imageUrl: true,
  //     price: true,
  //   },
  // },
  slug: true,
  name: true,
  year: true,
  imageUrl: true,
} as const;

export type CarModelRecord = Awaited<
  ReturnType<typeof carModelRepository.findById>
>;

export const carModelRepository = {
  findById: (id: number) =>
    prisma.carModel.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findBySlug: (slug: string) =>
    prisma.carModel.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findByBrand: (
    brandId: number,
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.carModel.findMany({
      where: { brandId },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { name: "asc" },
    }),

  findByIds: (ids: number[]) =>
    prisma.carModel.findMany({
      where: { id: { in: ids } },
      select: publicSelect,
    }),

  findMany: (
    where?: { brandId?: number; name?: string },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.carModel.findMany({
      where: {
        brandId: where?.brandId,
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { name: "asc" },
    }),

  count: (where?: { brandId?: number; name?: string }) =>
    prisma.carModel.count({
      where: {
        brandId: where?.brandId,
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
      },
    }),

  create: (data: { brandId: number; name: string; year?: string }) =>
    prisma.carModel.create({
      data,
      select: publicSelect,
    }),

  update: (
    id: number,
    data: { brandId?: number; name?: string; year?: string },
  ) =>
    prisma.carModel.update({
      where: { id },
      data,
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.carModel.delete({
      where: { id },
      select: publicSelect,
    }),
};
