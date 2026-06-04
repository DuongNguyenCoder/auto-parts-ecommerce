"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/stores/cart/cart.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { SyncCartDTO } from "@/validations/cart.schema";

const DEBOUNCE_DELAY = 3000; // 3 seconds

export const useCartSync = () => {
  //   const { isAuthenticated } = useAuth();
  const isAuthenticated = true;
  const items = useCartStore((state) => state.items);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);
  console.log("cart sync render");
  console.log(isAuthenticated);

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
        const payload: SyncCartDTO = {
          items: items.map((item) => ({
            productId: item.productId,
            skuId: item.skuId,
            slug: item.slug,
            quantity: item.quantity,
          })),
        };

        const response = await fetch(`/api/carts/sync`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Cart sync error:", error);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error);
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
