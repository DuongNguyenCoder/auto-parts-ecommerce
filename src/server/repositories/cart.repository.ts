import { prisma } from "@/server/prisma";

export const cartRepository = {
  findByUserId: (userId: string) =>
    prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    }),

  createCart: (userId: string) =>
    prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    }),

  findItem: (cartId: string, productId: number, slug?: string | null) =>
    prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        slug: slug ?? null,
      },
      include: {
        product: true,
      },
    }),

  findItemById: (id: number) =>
    prisma.cartItem.findUnique({
      where: { id },
      include: {
        product: true,
        cart: true,
      },
    }),

  createItem: (data: {
    cartId: string;
    productId: number;
    slug?: string | null;
    quantity: number;
  }) =>
    prisma.cartItem.create({
      data: {
        cart: { connect: { id: data.cartId } },
        product: { connect: { id: data.productId } },
        slug: data.slug,
        quantity: data.quantity,
      },
      include: {
        product: true,
      },
    }),

  updateItem: (id: number, data: { quantity: number }) =>
    prisma.cartItem.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    }),

  deleteItem: (id: number) =>
    prisma.cartItem.delete({
      where: { id },
    }),
};
