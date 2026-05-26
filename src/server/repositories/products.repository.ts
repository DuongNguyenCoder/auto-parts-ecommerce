import { prisma } from "@/server/prisma";

const publicSelect = {
  id: true,
  slug: true,
  name: true,
  imageUrl: true,
  price: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  fitments: {
    select: {
      id: true,
      brandId: true,
      name: true,
      year: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

type ProductWriteData = {
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  fitmentIds?: number[];
};

type ProductUpdateData = Partial<ProductWriteData>;

const toProductCreateData = (data: ProductWriteData) => {
  const { fitmentIds, ...productData } = data;

  return {
    ...productData,
    fitments: fitmentIds
      ? {
          connect: fitmentIds.map((id) => ({ id })),
        }
      : undefined,
  };
};

const toProductUpdateData = (data: ProductUpdateData) => {
  const { fitmentIds, ...productData } = data;

  return {
    ...productData,
    fitments: fitmentIds
      ? {
          set: fitmentIds.map((id) => ({ id })),
        }
      : undefined,
  };
};

export type ProductRecord = Awaited<
  ReturnType<typeof productRepository.findById>
>;

export const productRepository = {
  findById: (id: number) =>
    prisma.product.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findBySlug: (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      select: publicSelect,
    }),

  findByIds: (ids: number[]) =>
    prisma.product.findMany({
      where: { id: { in: ids } },
      select: publicSelect,
    }),

  findMany: (
    where?: { name?: string; categoryId?: number; carModelId?: number },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.product.findMany({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
        categoryId: where?.categoryId,
        fitments: where?.carModelId
          ? { some: { id: where.carModelId } }
          : undefined,
      },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { createdAt: "desc" },
    }),

  count: (where?: {
    name?: string;
    categoryId?: number;
    carModelId?: number;
  }) =>
    prisma.product.count({
      where: {
        name: where?.name
          ? { contains: where.name, mode: "insensitive" }
          : undefined,
        categoryId: where?.categoryId,
        fitments: where?.carModelId
          ? { some: { id: where.carModelId } }
          : undefined,
      },
    }),

  create: (data: ProductWriteData) =>
    prisma.product.create({
      data: toProductCreateData(data),
      select: publicSelect,
    }),

  update: (id: number, data: ProductUpdateData) =>
    prisma.product.update({
      where: { id },
      data: toProductUpdateData(data),
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.product.delete({
      where: { id },
      select: publicSelect,
    }),
};
