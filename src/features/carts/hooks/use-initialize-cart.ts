"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart/cart.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cartApi } from "@/features/carts/api/cart.api";

export const useInitializeCart = () => {
  //   const { isAuthenticated } = useAuth();

  const isAuthenticated = true;
  const { replaceCart } = useCartStore((state) => ({
    replaceCart: state.replaceCart,
  }));

  useEffect(() => {
    const initializeCart = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const response = await cartApi.getCart();
        if (response.data?.items) {
          // Transform DB cart items to store format
          const transformedItems = response.data.items.map((item: any) => ({
            id: Number(item.id),
            productId: item.productId,
            skuId: item.skuId,
            slug: item.slug,
            name: item.product?.name || "",
            image: item.product?.imageUrl || "",
            price: Number(item.product?.price || 0),
            quantity: item.quantity,
            stock: 9999, // Default high stock value
            brand: {
              id: Number(item.product?.categoryId || ""),
              name: item.product?.category?.name || "",
            },
          }));

          replaceCart(transformedItems);
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      }
    };

    initializeCart();
  }, [isAuthenticated, replaceCart]);
};
