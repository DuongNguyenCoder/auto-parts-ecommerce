import type { Product } from "@/types/product.type";

export type CartItem = {
  id: number;
  cartId: string;
  productId: number;
  slug?: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
};
