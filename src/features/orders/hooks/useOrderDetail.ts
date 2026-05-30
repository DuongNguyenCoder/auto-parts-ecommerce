"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/features/orders/api/order.api";
import type { UpdateOrderDTO } from "@/validations/order.schema";

export const useOrderDetail = (orderId: string) => {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    },
    enabled: !!orderId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateOrderDTO) =>
      orderApi.updateOrder(orderId, payload),
    onSuccess: (response) => {
      queryClient.setQueryData(["order", orderId], response.data);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    error: orderQuery.error,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
