import type {
  WishlistActions,
  WishlistItem,
  WishlistState,
} from "./wishlist.types";
import {
  createWishlistItemKey,
  mergeWishlistItems,
  areWishlistItemsEqual,
} from "./wishlist.utils";
import type { StateCreator } from "zustand";

type WishlistStore = WishlistState & WishlistActions;
type WishlistSet = Parameters<StateCreator<WishlistStore>>[0];
type WishlistGet = Parameters<StateCreator<WishlistStore>>[1];

const sanitizeItem = (item: Omit<WishlistItem, "id">): WishlistItem => ({
  ...item,
  id: createWishlistItemKey(item),
});

export const buildWishlistActions = (
  set: WishlistSet,
  get: WishlistGet,
): WishlistActions => ({
  addItem: (item) => {
    const nextItem = sanitizeItem(item);
    set((state) => {
      if (state.items.some((entry) => areWishlistItemsEqual(entry, nextItem))) {
        return state;
      }

      return {
        items: [...state.items, nextItem],
        lastUpdated: new Date().toISOString(),
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      lastUpdated: new Date().toISOString(),
    }));
  },

  toggleItem: (item) => {
    const nextItem = sanitizeItem(item);
    const exists = get().items.some((entry) =>
      areWishlistItemsEqual(entry, nextItem),
    );

    if (exists) {
      set((state) => ({
        items: state.items.filter((entry) => entry.id !== nextItem.id),
        lastUpdated: new Date().toISOString(),
      }));
      return;
    }

    set((state) => ({
      items: [...state.items, nextItem],
      lastUpdated: new Date().toISOString(),
    }));
  },

  clearWishlist: () => {
    set({ items: [], lastUpdated: new Date().toISOString() });
  },

  setItems: (items) => {
    set({
      items: items.map(sanitizeItem),
      lastUpdated: new Date().toISOString(),
    });
  },

  replaceWishlist: (items) => {
    set({
      items: items.map(sanitizeItem),
      lastUpdated: new Date().toISOString(),
    });
  },

  mergeGuestWishlist: (items) => {
    set((state) => ({
      items: mergeWishlistItems(state.items, items.map(sanitizeItem)),
      lastUpdated: new Date().toISOString(),
    }));
  },

  syncServerWishlist: (items) => {
    set({
      items: items.map(sanitizeItem),
      lastUpdated: new Date().toISOString(),
    });
  },

  resetWishlist: () => {
    set({ items: [], lastUpdated: new Date().toISOString(), isHydrated: true });
  },

  hydrate: () => {
    set({ isHydrated: true });
  },

  isWishlisted: (itemId) => get().items.some((item) => item.id === itemId),
});
