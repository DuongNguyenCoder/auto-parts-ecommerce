"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/stores/wishlist/wishlist.store";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { wishlistApi } from "@/features/wishlist/api/wishlist.api";

export const useInitializeWishlist = () => {
  //   const { isAuthenticated } = useAuth();

  const isAuthenticated = true;
  const { replaceWishlist } = useWishlistStore((state) => ({
    replaceWishlist: state.replaceWishlist,
  }));

  useEffect(() => {
    const initializeWishlist = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const response = await wishlistApi.getList();
        if (response.data) {
          // Transform DB wishlist items to store format
          const transformedItems = response.data.map((item: any) => ({
            id: String(item.id),
            productId: item.productId,
            slug: item.product?.slug || "",
            name: item.product?.name || "",
            image: item.product?.imageUrl || "",
            price: item.product?.price || 0,
          }));

          replaceWishlist(transformedItems);
        }
      } catch (error) {
        console.error("Failed to initialize wishlist:", error);
      }
    };

    initializeWishlist();
  }, [isAuthenticated, replaceWishlist]);
};
