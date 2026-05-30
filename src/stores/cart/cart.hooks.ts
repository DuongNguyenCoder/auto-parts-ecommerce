import { useMemo } from "react";
import { useCartStore } from "./cart.store";
import {
  selectCartCount,
  selectCartHydrated,
  selectCartItemById,
  selectCartItems,
  selectCartQuantity,
  selectCartTotal,
  selectIsInCart,
} from "./cart.selectors";

export const useCart = () => useCartStore(selectCartItems);

export const useCartCount = () => useCartStore(selectCartCount);

export const useCartTotal = () => useCartStore(selectCartTotal);

export const useCartHydrated = () => useCartStore(selectCartHydrated);

export const useCartItem = (itemId: number) => {
  const selector = useMemo(() => selectCartItemById(itemId), [itemId]);
  return useCartStore(selector);
};

export const useIsInCart = (itemId: number) => {
  const selector = useMemo(() => selectIsInCart(itemId), [itemId]);
  return useCartStore(selector);
};

export const useCartQuantity = (itemId: number) => {
  const selector = useMemo(() => selectCartQuantity(itemId), [itemId]);
  return useCartStore(selector);
};
