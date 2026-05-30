import { createPersistedStore } from "@/stores/core/create-store";
import { cartPersistConfig } from "./cart.persist";
import { CART_STORE_NAME } from "./cart.constants";
import { buildCartActions } from "./cart.actions";
import type { CartActions, CartState } from "./cart.types";

const initialState: CartState = {
  items: [],
  isHydrated: false,
  lastUpdated: null,
};

export const useCartStore = createPersistedStore<
  CartState & CartActions,
  CartState
>(
  (set, get) => ({
    ...initialState,
    ...buildCartActions(set, get),
  }),
  {
    ...cartPersistConfig,
    onRehydrateStorage: () => (state) => {
      if (state) {
        state.isHydrated = true;
      }
    },
  },
  CART_STORE_NAME,
);
