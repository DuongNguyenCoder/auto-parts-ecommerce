"use client";

import { useCallback, useState } from "react";
import { orderApi } from "@/features/orders/api/order.api";
import type { Order } from "@/types";
import type { UpdateOrderDTO } from "@/validations/order.schema";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders/admin", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message ?? "Failed to fetch orders");
      }

      setOrders(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // const updateOrder = useCallback(
  //   async (id: string, payload: UpdateOrderDTO) => {
  //     try {
  //       const response = await orderApi.updateOrder(id, payload);
  //       setOrders((prev) =>
  //         prev?.map((order) => (order?.id === id ? response.data : order)),
  //       );
  //       return response.data;
  //     } catch (err) {
  //       const message =
  //         err instanceof Error ? err.message : "Failed to update order";
  //       throw new Error(message);
  //     }
  //   },
  //   [],
  // );

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    // updateOrder,
  };
};
