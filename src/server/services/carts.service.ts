import { AppError } from "@/server/http/app-error";
import { cartRepository } from "@/server/repositories/cart.repository";
import { productRepository } from "@/server/repositories/products.repository";
import { prisma } from "@/server/prisma";
import type {
  AddCartItemDTO,
  UpdateCartItemDTO,
  SyncCartDTO,
} from "@/validations/cart.schema";

const getOrCreateCart = async (userId: string) => {
  const existingCart = await cartRepository.findByUserId(userId);
  if (existingCart) {
    return existingCart;
  }

  return cartRepository.createCart(userId);
};

export const cartService = {
  getCartByUserId: async (userId: string) => {
    return getOrCreateCart(userId);
  },

  addItem: async (userId: string, data: AddCartItemDTO) => {
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const cart = await getOrCreateCart(userId);
    const existingItem = await cartRepository.findItem(
      cart.id,
      data.productId,
      data.slug,
    );

    if (existingItem) {
      await cartRepository.updateItem(existingItem.id, {
        quantity: existingItem.quantity + data.quantity,
      });
      const updatedCart = await cartRepository.findByUserId(userId);
      if (!updatedCart) {
        throw new AppError("Cart not found", 500);
      }
      return updatedCart;
    }

    await cartRepository.createItem({
      cartId: cart.id,
      productId: data.productId,
      slug: data.slug,
      quantity: data.quantity,
    });

    const createdCart = await cartRepository.findByUserId(userId);
    if (!createdCart) {
      throw new AppError("Cart not found", 500);
    }
    return createdCart;
  },

  updateItem: async (
    userId: string,
    cartItemId: number,
    data: UpdateCartItemDTO,
  ) => {
    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    if (cartItem.cart.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    if (data.quantity === 0) {
      await cartRepository.deleteItem(cartItemId);
      const cart = await cartRepository.findByUserId(userId);
      if (!cart) {
        throw new AppError("Cart not found", 500);
      }
      return cart;
    }

    await cartRepository.updateItem(cartItemId, { quantity: data.quantity });
    const updatedCart = await cartRepository.findByUserId(userId);
    if (!updatedCart) {
      throw new AppError("Cart not found", 500);
    }
    return updatedCart;
  },

  removeItem: async (userId: string, cartItemId: number) => {
    const cartItem = await cartRepository.findItemById(cartItemId);
    if (!cartItem) {
      throw new AppError("Cart item not found", 404);
    }

    if (cartItem.cart.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    await cartRepository.deleteItem(cartItemId);
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError("Cart not found", 500);
    }
    return cart;
  },

  syncCart: async (userId: string, data: SyncCartDTO) => {
    const cart = await getOrCreateCart(userId);

    // Delete all existing items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // If no items to sync, return empty cart
    if (data.items.length === 0) {
      return cartRepository.findByUserId(userId);
    }

    // Verify all products exist
    const productIds = data.items.map((item) => item.productId);
    const products = await productRepository.findByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      if (!productMap.has(item.productId)) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
    }

    // Create new items
    for (const item of data.items) {
      await cartRepository.createItem({
        cartId: cart.id,
        productId: item.productId,
        slug: item.slug,
        quantity: item.quantity,
      });
    }

    const syncedCart = await cartRepository.findByUserId(userId);
    if (!syncedCart) {
      throw new AppError("Cart not found", 500);
    }
    return syncedCart;
  },
};
