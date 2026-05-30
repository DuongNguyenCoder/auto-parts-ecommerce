import { createPersistOptions } from "@/stores/core/persist-options";
import {
  WISHLIST_STORE_KEY,
  WISHLIST_STORE_VERSION,
} from "./wishlist.constants";
import type { WishlistState, WishlistActions } from "./wishlist.types";

export const wishlistPersistConfig = createPersistOptions<
  WishlistState & WishlistActions,
  WishlistState
>(WISHLIST_STORE_KEY, WISHLIST_STORE_VERSION, ["items", "lastUpdated"]);
