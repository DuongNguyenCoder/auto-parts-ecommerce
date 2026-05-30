import { createPersistOptions } from "@/stores/core/persist-options";
import { CART_STORE_KEY, CART_STORE_VERSION } from "./cart.constants";
import type { CartState, CartActions } from "./cart.types";

export const cartPersistConfig = createPersistOptions<
  CartState & CartActions,
  CartState
>(CART_STORE_KEY, CART_STORE_VERSION, ["items", "lastUpdated"]);
