import { prisma } from "@/server/prisma";

export const wishlistRepository = {
  findByUserId: (userId: string) =>
    prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
    }),

  findByUserAndProduct: (userId: string, productId: number) =>
    prisma.wishlistItem.findFirst({
      where: { userId, productId },
      include: { product: true },
    }),

  findById: (id: string) =>
    prisma.wishlistItem.findUnique({
      where: { id },
      include: { product: true },
    }),

  create: (data: { userId: string; productId: number }) =>
    prisma.wishlistItem.create({
      data,
      include: { product: true },
    }),

  delete: (id: string) =>
    prisma.wishlistItem.delete({
      where: { id },
      include: { product: true },
    }),
};
