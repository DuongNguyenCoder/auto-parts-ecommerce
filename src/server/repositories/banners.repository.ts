import { prisma } from "../prisma";

const publicSelect = {
  id: true,
  title: true,
  imageUrl: true,
  link: true,
  isActive: true,
  sortOrder: true,
} as const;

export type BannerRecord = Awaited<
  ReturnType<typeof bannerRepository.findById>
>;

export const bannerRepository = {
  findById: (id: number) =>
    prisma.banner.findUnique({
      where: { id },
      select: publicSelect,
    }),

  findActive: (pagination?: { take?: number; skip?: number }) =>
    prisma.banner.findMany({
      where: { isActive: true },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { sortOrder: "asc" },
    }),

  findMany: (
    where?: { isActive?: boolean },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.banner.findMany({
      where: { isActive: where?.isActive },
      select: publicSelect,
      take: pagination?.take,
      skip: pagination?.skip,
      orderBy: { sortOrder: "asc" },
    }),

  create: (data: {
    title?: string;
    imageUrl: string;
    link?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) =>
    prisma.banner.create({
      data,
      select: publicSelect,
    }),

  update: (
    id: number,
    data: {
      title?: string;
      imageUrl?: string;
      link?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
  ) =>
    prisma.banner.update({
      where: { id },
      data,
      select: publicSelect,
    }),

  delete: (id: number) =>
    prisma.banner.delete({
      where: { id },
      select: publicSelect,
    }),
};
