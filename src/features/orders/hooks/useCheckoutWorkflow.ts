"use client";

import { useCallback, useMemo, useState } from "react";
import { cartApi } from "@/features/carts/api/cart.api";
import { orderApi } from "@/features/orders/api/order.api";
import { useCartStore } from "@/stores/cart/cart.store";
import type { CartItem } from "@/stores";
import type { CreateOrderDTO } from "@/validations/order.schema";
import type { SyncCartDTO } from "@/validations/cart.schema";

const getShippingFee = (subtotal: number) => {
  if (subtotal <= 0) {
    return 0;
  }

  return subtotal >= 1000000 ? 0 : 50000;
};

const toOrderItems = (items: CartItem[]) =>
  items.map((item) => ({ productId: item.productId, quantity: item.quantity }));

const toSyncItems = (items: CartItem[]) =>
  items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    quantity: item.quantity,
  }));

export const useCheckoutWorkflow = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const shippingFee = useMemo(() => getShippingFee(subtotal), [subtotal]);

  const handleConfirmOrder = useCallback(
    async (payload: Omit<CreateOrderDTO, "items" | "shippingFee">) => {
      if (items.length === 0) {
        setError(
          "Giỏ hàng hiện đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.",
        );
        return;
      }

      setError(null);
      setIsSubmitting(true);
      setSuccess(false);

      const orderPayload: CreateOrderDTO = {
        items: toOrderItems(items),
        shippingFee,
        ...payload,
      };

      const syncPayload: SyncCartDTO = {
        items: toSyncItems(items),
      };

      try {
        await Promise.all([
          cartApi.syncCart(syncPayload),
          orderApi.createOrder(orderPayload),
        ]);
        setSuccess(true);
        clearCart();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể hoàn tất đơn hàng. Vui lòng thử lại.";
        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [clearCart, items, shippingFee],
  );

  return {
    items,
    subtotal,
    shippingFee,
    isSubmitting,
    error,
    success,
    handleConfirmOrder,
  };
};
