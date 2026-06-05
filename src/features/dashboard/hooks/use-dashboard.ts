import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/features/orders/api/order.api";
import { userApi } from "@/features/users/api/user.api";
import { postApi } from "@/features/posts/api/post.api";
import { productApi } from "@/features/products/api/product.api";
import { listConsultations } from "@/features/consultations/actions";
import type { Order, OrderStatus } from "@/types";

/**
 * Fetch orders by status with TanStack Query
 * Shares cache key for consistency across pages
 */
export function useOrdersByStatus(status: OrderStatus, enabled = true) {
  return useQuery({
    queryKey: ["orders", { status }],
    queryFn: async () => {
      const response = await orderApi.getAllByAdmin({
        status,
        take: 10,
        skip: 0,
      });
      return response.data?.items ?? [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch all orders (unfiltered) for dashboard overview
 */
export function useOrdersOverview() {
  return useQuery({
    queryKey: ["orders", { overview: true }],
    queryFn: async () => {
      const response = await orderApi.getAllByAdmin({
        take: 100,
        skip: 0,
      });
      return response.data?.items ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch pending orders (PENDING + PROCESSING status)
 */
export function useUnprocessedOrders() {
  const pending = useOrdersByStatus("PENDING");
  const processing = useOrdersByStatus("PROCESSING");

  return {
    data: [pending.data ?? [], processing.data ?? []].flat(),
    isLoading: pending.isLoading || processing.isLoading,
    error: pending.error || processing.error,
  };
}

/**
 * Fetch users count/total - calls API with take: 1 to get pagination
 */
export function useDashboardUsers() {
  return useQuery({
    queryKey: ["users", { dashboard: true }],
    queryFn: async () => {
      const response = await userApi.getAll({
        take: 1,
        skip: 0,
      });
      return {
        items: response.data?.items ?? [],
        pagination: response.data?.pagination,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Fetch posts count/total - calls API with take: 1
 */
export function useDashboardPosts() {
  return useQuery({
    queryKey: ["posts", { dashboard: true }],
    queryFn: async () => {
      const response = await postApi.getAll({
        take: 1,
        skip: 0,
      });
      return {
        items: response.data?.items ?? [],
        pagination: response.data?.pagination,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Fetch products count/total - calls API with take: 1
 */
export function useDashboardProducts() {
  const demo = useQuery({
    queryKey: ["products", { dashboard: true }],
    queryFn: async () => {
      const response = await productApi.getAll({
        take: 1,
        skip: 0,
      });
      return {
        items: response.data?.items ?? [],
        pagination: response.data?.pagination,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
  console.log("DEMO USE QUERY => ", demo);
  return demo;
}

/**
 * Fetch consultations - using server action
 */
export function useDashboardConsultations() {
  return useQuery({
    queryKey: ["consultations", { dashboard: true }],
    queryFn: async () => {
      const result = await listConsultations(undefined, { take: 1, skip: 0 });
      return result;
    },
    staleTime: 1000 * 60 * 10,
  });
}
