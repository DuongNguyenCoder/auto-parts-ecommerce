"use client";

import { useEffect, useRef } from "react";

import { useCartStore } from "@/stores/cart/cart.store";
import { cartApi } from "@/features/carts/api/cart.api";
import { CartItem, Product } from "@/types";
import { SyncCartDTO, SyncCartItemDTO } from "@/validations/cart.schema";

const SYNC_DELAY = 60000;

export function useCartSyncV2() {
  const items = useCartStore((s) => s.items);
  const isHydrated = useCartStore((s) => s.isHydrated);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const previousSerializedRef = useRef("");

  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    const serialized = JSON.stringify(items);

    // tránh sync duplicate
    if (serialized === previousSerializedRef.current) {
      return;
    }

    // if (!isSyncingRef.current) {
    //   previousSerializedRef.current = serialized;

    //   isSyncingRef.current = true;

    //   return;
    // }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      // tránh concurrent request
      if (isSyncingRef.current) return;

      try {
        isSyncingRef.current = true;

        const payload: SyncCartDTO = {
          items: items.map((item: any) => ({
            productId: Number(item.productId),
            slug: item.slug,
            quantity: item.quantity,
          })),
        };

        await cartApi.syncCart(payload);

        previousSerializedRef.current = serialized;
      } catch (error) {
        console.error("[Cart Sync Error]", error);
      } finally {
        isSyncingRef.current = false;
      }
    }, SYNC_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items, isHydrated]);
}
