import type { Product } from "@/types/product.type";

export type WishlistItem = {
  id: string;
  userId: string;
  productId: number;
  product: Product;
  createdAt: string;
};
