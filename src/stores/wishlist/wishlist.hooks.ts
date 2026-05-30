import { useMemo } from "react";
import { useWishlistStore } from "./wishlist.store";
import {
  selectIsWishlisted,
  selectWishlistCount,
  selectWishlistHydrated,
  selectWishlistItems,
} from "./wishlist.selectors";

export const useWishlist = () => useWishlistStore(selectWishlistItems);

export const useWishlistCount = () => useWishlistStore(selectWishlistCount);

export const useWishlistHydrated = () =>
  useWishlistStore(selectWishlistHydrated);

export const useIsWishlisted = (itemId: string) => {
  const selector = useMemo(() => selectIsWishlisted(itemId), [itemId]);
  return useWishlistStore(selector);
};
