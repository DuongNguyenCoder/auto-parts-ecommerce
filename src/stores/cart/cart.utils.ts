import type { CartItem } from "./cart.types";
import { clamp } from "@/stores/core/store-helpers";
import { CART_MAX_QUANTITY } from "./cart.constants";

export const createItemKey = (item: Pick<CartItem, "productId" | "skuId">) => {
  // return item.productId item.skuId ?? "";

  return item.productId;
};

export const areItemsEqual = (left: CartItem, right: CartItem) => {
  return left.productId === right.productId && left.skuId === right.skuId;
};

export const normalizeQuantity = (quantity: number) => {
  return clamp(Math.max(quantity, 1), 1, CART_MAX_QUANTITY);
};

export const mergeCartItems = (existing: CartItem[], incoming: CartItem[]) => {
  const merged = [...existing];

  incoming.forEach((incomingItem) => {
    const existingIndex = merged.findIndex((item) =>
      areItemsEqual(item, incomingItem),
    );

    if (existingIndex >= 0) {
      const existingItem = merged[existingIndex];
      const nextQuantity = Math.min(
        existingItem.quantity + incomingItem.quantity,
        incomingItem.stock,
      );
      merged[existingIndex] = {
        ...incomingItem,
        quantity: nextQuantity,
      };
      return;
    }

    merged.push({
      ...incomingItem,
      quantity: Math.min(incomingItem.quantity, incomingItem.stock),
    });
  });

  return merged.map((item) => ({
    ...item,
    quantity: Math.min(Math.max(item.quantity, 1), item.stock),
  }));
};

export const clampCartQuantity = (quantity: number, stock: number) => {
  return clamp(Math.min(Math.max(quantity, 1), stock), 1, stock);
};
