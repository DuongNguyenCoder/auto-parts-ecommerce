import { AppError } from "@/server/http/app-error";
import { productRepository } from "@/server/repositories/products.repository";
import { wishlistRepository } from "@/server/repositories/wishlist.repository";
import { prisma } from "@/server/prisma";
import type {
  AddWishlistItemDTO,
  SyncWishlistDTO,
} from "@/validations/wishlist.schema";

export const wishlistService = {
  getListByUserId: async (userId: string) => {
    return wishlistRepository.findByUserId(userId);
  },

  addItem: async (userId: string, data: AddWishlistItemDTO) => {
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw new AppError("Product not found", 404);
    }

    const existingItem = await wishlistRepository.findByUserAndProduct(
      userId,
      data.productId,
    );
    if (existingItem) {
      throw new AppError("Wishlist item already exists", 409);
    }

    return wishlistRepository.create({
      userId,
      productId: data.productId,
    });
  },

  removeItem: async (userId: string, id: string) => {
    const item = await wishlistRepository.findById(id);
    if (!item) {
      throw new AppError("Wishlist item not found", 404);
    }

    if (item.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return wishlistRepository.delete(id);
  },

  syncWishlist: async (userId: string, data: SyncWishlistDTO) => {
    // Delete all existing items
    await prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    // If no items to sync, return empty list
    if (data.items.length === 0) {
      return wishlistRepository.findByUserId(userId);
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
      await wishlistRepository.create({
        userId,
        productId: item.productId,
      });
    }

    return wishlistRepository.findByUserId(userId);
  },
};
