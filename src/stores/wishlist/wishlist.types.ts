export type WishlistItem = {
  id: string;
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
};

export type WishlistState = {
  items: WishlistItem[];
  isHydrated: boolean;
  lastUpdated: string | null;
};

export type WishlistActions = {
  addItem: (item: Omit<WishlistItem, "id">) => void;
  removeItem: (itemId: string) => void;
  toggleItem: (item: Omit<WishlistItem, "id">) => void;
  clearWishlist: () => void;
  setItems: (items: WishlistItem[]) => void;
  replaceWishlist: (items: WishlistItem[]) => void;
  mergeGuestWishlist: (items: WishlistItem[]) => void;
  syncServerWishlist: (items: WishlistItem[]) => void;
  resetWishlist: () => void;
  hydrate: () => void;
  isWishlisted: (itemId: string) => boolean;
};
