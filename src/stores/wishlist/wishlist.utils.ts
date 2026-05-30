import type { WishlistItem } from "./wishlist.types";

export const createWishlistItemKey = (item: Omit<WishlistItem, "id">) => {
  return `${item.productId}`;
};

export const areWishlistItemsEqual = (
  left: WishlistItem | Omit<WishlistItem, "id">,
  right: WishlistItem | Omit<WishlistItem, "id">,
) => left.productId === right.productId;

export const mergeWishlistItems = (
  existing: WishlistItem[],
  incoming: WishlistItem[],
) => {
  const result = [...existing];

  incoming.forEach((item) => {
    const hasItem = result.some((entry) => areWishlistItemsEqual(entry, item));
    if (!hasItem) {
      result.push({ ...item, id: createWishlistItemKey(item) });
    }
  });

  return result;
};
