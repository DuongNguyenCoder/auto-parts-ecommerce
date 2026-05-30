"use client";

import { useEffect, useRef } from "react";
import { useWishlistStore } from "@/stores/wishlist/wishlist.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { SyncWishlistDTO } from "@/validations/wishlist.schema";

const DEBOUNCE_DELAY = 3000; // 3 seconds

export const useWishlistSync = () => {
  //   const { isAuthenticated } = useAuth();
  const isAuthenticated = true;
  const items = useWishlistStore((state) => state.items);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);

  useEffect(() => {
    // Only sync if authenticated
    if (!isAuthenticated) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      // Prevent multiple concurrent syncs
      if (syncInProgressRef.current) {
        return;
      }

      syncInProgressRef.current = true;

      try {
        const payload: SyncWishlistDTO = {
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
          })),
        };

        const response = await fetch(`${getBaseUrl()}/api/wishlist/sync`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Wishlist sync error:", error);
        }
      } catch (error) {
        console.error("Failed to sync wishlist:", error);
      } finally {
        syncInProgressRef.current = false;
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [items, isAuthenticated]);

  return { isAuthenticated };
};
