"use client";

import { ReactNode } from "react";
import { useInitializeCart } from "@/features/carts/hooks/use-initialize-cart";
import { useCartSync } from "@/features/carts/hooks/use-cart-sync";
import { useInitializeWishlist } from "@/features/wishlist/hooks/use-initialize-wishlist";
import { useWishlistSync } from "@/features/wishlist/hooks/use-wishlist-sync";
import { useCartSyncV2 } from "@/features/carts/hooks/useCartSync";

/**
 * CartWishlistSyncProvider
 *
 * Manages the complete lifecycle of cart and wishlist synchronization:
 *
 * 1. **Initialization on Login**: When user authenticates, fetches cart and wishlist from DB
 *    and syncs them with the local Zustand stores
 *
 * 2. **Debounced Sync on Changes**: When user adds/removes items from local stores,
 *    debounces changes for 3 seconds before syncing to DB to minimize API calls
 *
 * 3. **Cleanup on Logout**: When user logs out, stores remain as-is for next login
 *
 * Usage:
 * Wrap this provider at the app layout level to ensure it runs for all pages:
 *
 * ```tsx
 * <CartWishlistSyncProvider>
 *   {children}
 * </CartWishlistSyncProvider>
 * ```
 *
 * Architecture:
 * - useInitializeCart: Loads cart from DB on login
 * - useCartSync: Syncs local cart changes to DB (debounced 3s)
 * - useInitializeWishlist: Loads wishlist from DB on login
 * - useWishlistSync: Syncs local wishlist changes to DB (debounced 3s)
 */
export function CartWishlistSyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize cart and wishlist from DB on login
  //   useInitializeCart();
  //   useInitializeWishlist();
  useCartSyncV2();

  //   // Setup debounced sync for cart and wishlist changes
  //   useCartSync();
  //   useWishlistSync();

  return <>{children}</>;
}
