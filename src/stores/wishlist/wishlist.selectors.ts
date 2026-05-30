import type { WishlistState } from "./wishlist.types";

export const selectWishlistItems = (state: WishlistState) => state.items;

export const selectWishlistHydrated = (state: WishlistState) =>
  state.isHydrated;

export const selectWishlistCount = (state: WishlistState) => state.items.length;

export const selectIsWishlisted = (itemId: string) => (state: WishlistState) =>
  state.items.some((item) => item.id === itemId);
