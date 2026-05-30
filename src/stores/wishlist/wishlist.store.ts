import { createPersistedStore } from "@/stores/core/create-store";
import { wishlistPersistConfig } from "./wishlist.persist";
import { WISHLIST_STORE_NAME } from "./wishlist.constants";
import { buildWishlistActions } from "./wishlist.actions";
import type { WishlistActions, WishlistState } from "./wishlist.types";

const initialState: WishlistState = {
  items: [],
  isHydrated: false,
  lastUpdated: null,
};

export const useWishlistStore = createPersistedStore<
  WishlistState & WishlistActions,
  WishlistState
>(
  (set, get) => ({
    ...initialState,
    ...buildWishlistActions(set, get),
  }),
  {
    ...wishlistPersistConfig,
    onRehydrateStorage: () => (state) => {
      if (state) {
        state.isHydrated = true;
      }
    },
  },
  WISHLIST_STORE_NAME,
);
