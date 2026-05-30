import type { CartState } from "./cart.types";

export const selectCartItems = (state: CartState) => state.items;

export const selectCartHydrated = (state: CartState) => state.isHydrated;

export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce(
    (subtotal, item) => subtotal + item.price * item.quantity,
    0,
  );

export const selectCartTotal = (state: CartState) =>
  state.items.reduce(
    (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
    0,
  );

export const selectCartItemById = (itemId: number) => (state: CartState) =>
  state.items.find((item) => item.id === itemId);

export const selectIsInCart = (itemId: number) => (state: CartState) =>
  state.items.some((item) => item.id === itemId);

export const selectCartQuantity = (itemId: number) => (state: CartState) =>
  state.items.find((item) => item.id === itemId)?.quantity ?? 0;
