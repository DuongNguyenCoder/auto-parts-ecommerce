import type { CartActions, CartItem, CartState } from "./cart.types";
import {
  areItemsEqual,
  clampCartQuantity,
  createItemKey,
  mergeCartItems,
} from "./cart.utils";
import { CART_MIN_QUANTITY } from "./cart.constants";
import type { StateCreator } from "zustand";

type CartStore = CartState & CartActions;
type CartSet = Parameters<StateCreator<CartStore>>[0];
type CartGet = Parameters<StateCreator<CartStore>>[1];

const sanitizeItem = (item: Omit<CartItem, "id">) => {
  return {
    ...item,
    quantity: clampCartQuantity(item.quantity, item.stock),
  } as CartItem;
};

export const buildCartActions = (set: CartSet, get: CartGet): CartActions => ({
  addItem: (item) => {
    const nextItem = sanitizeItem(item);
    set((state) => {
      const existingIndex = state.items.findIndex((entry) =>
        areItemsEqual(entry, nextItem),
      );

      const nextItems = [...state.items];

      if (existingIndex >= 0) {
        const existing = nextItems[existingIndex];
        nextItems[existingIndex] = {
          ...existing,
          quantity: clampCartQuantity(
            existing.quantity + nextItem.quantity,
            nextItem.stock,
          ),
        };
      } else {
        nextItems.push({
          ...nextItem,
          id: createItemKey(nextItem),
        });
      }

      return {
        items: nextItems,
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

  clearCart: () => {
    set({ items: [], lastUpdated: new Date().toISOString() });
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      const nextQuantity = Math.max(quantity, CART_MIN_QUANTITY);
      const nextItems = state.items
        .map((item) =>
          item.id !== itemId
            ? item
            : {
                ...item,
                quantity: clampCartQuantity(nextQuantity, item.stock),
              },
        )
        .filter((item) => item.quantity > 0);

      return {
        items: nextItems,
        lastUpdated: new Date().toISOString(),
      };
    });
  },

  incrementQuantity: (itemId) => {
    const item = get().items.find((entry) => entry.id === itemId);
    if (!item) {
      return;
    }

    set((state) => ({
      items: state.items.map((entry) =>
        entry.id !== itemId
          ? entry
          : {
              ...entry,
              quantity: clampCartQuantity(entry.quantity + 1, entry.stock),
            },
      ),
      lastUpdated: new Date().toISOString(),
    }));
  },

  decrementQuantity: (itemId) => {
    const item = get().items.find((entry) => entry.id === itemId);
    if (!item) {
      return;
    }

    const nextQuantity = item.quantity - 1;
    if (nextQuantity <= 0) {
      set((state) => ({
        items: state.items.filter((entry) => entry.id !== itemId),
        lastUpdated: new Date().toISOString(),
      }));
      return;
    }

    set((state) => ({
      items: state.items.map((entry) =>
        entry.id !== itemId
          ? entry
          : {
              ...entry,
              quantity: clampCartQuantity(nextQuantity, entry.stock),
            },
      ),
      lastUpdated: new Date().toISOString(),
    }));
  },

  setItems: (items) => {
    set({
      items: items.map((item) => sanitizeItem(item)),
      lastUpdated: new Date().toISOString(),
    });
  },

  resetCart: () => {
    set({ items: [], lastUpdated: new Date().toISOString(), isHydrated: true });
  },

  hydrate: () => {
    set({ isHydrated: true });
  },

  syncServerCart: (items) => {
    set({
      items: items.map((item) => sanitizeItem(item)),
      lastUpdated: new Date().toISOString(),
    });
  },

  mergeGuestCart: (items) => {
    set((state) => ({
      items: mergeCartItems(state.items, items),
      lastUpdated: new Date().toISOString(),
    }));
  },

  replaceCart: (items) => {
    set({
      items: items.map((item) => sanitizeItem(item)),
      lastUpdated: new Date().toISOString(),
    });
  },
});
