import type { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/server/http/api-response";
import { orderService } from "@/server/services/orders.service";
import {
  createOrderSchema,
  updateOrderSchema,
} from "@/validations/order.schema";
import {
  OrderSortField,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingMethod,
  SortOrder,
} from "@/types";

export const ordersController = {
  getOrders: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const result = await orderService.getOrdersByUserId(userId);
      return successResponse("Orders retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getOrder: async (
    request: NextRequest,
    { id, userId }: { id: string; userId: string },
  ) => {
    try {
      const result = await orderService.getOrderById(userId, id);
      return successResponse("Order retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  createOrder: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const body = await request.json();
      const payload = createOrderSchema.parse(body);
      const result = await orderService.createOrder(userId, payload);
      return successResponse("Order created successfully", result, 201);
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateOrder: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const body = await request.json();
      const payload = updateOrderSchema.parse(body);
      const result = await orderService.updateOrder(id, payload);
      return successResponse("Order updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getAllOrders: async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = {
        limit: searchParams.get("limit")
          ? Number(searchParams.get("limit"))
          : undefined,

        skip: searchParams.get("skip")
          ? Number(searchParams.get("skip"))
          : undefined,

        sortBy:
          (searchParams.get("sortBy") as OrderSortField | null) ?? undefined,

        orderBy: (searchParams.get("orderBy") as SortOrder | null) ?? undefined,

        orderNumber: searchParams.get("orderNumber") ?? undefined,

        userId: searchParams.get("userId") ?? undefined,

        status: (searchParams.get("status") as OrderStatus | null) ?? undefined,

        paymentStatus:
          (searchParams.get("paymentStatus") as PaymentStatus | null) ??
          undefined,

        paymentMethod:
          (searchParams.get("paymentMethod") as PaymentMethod | null) ??
          undefined,

        shippingMethod:
          (searchParams.get("shippingMethod") as ShippingMethod | null) ??
          undefined,

        minTotal: searchParams.get("minTotal")
          ? Number(searchParams.get("minTotal"))
          : undefined,

        maxTotal: searchParams.get("maxTotal")
          ? Number(searchParams.get("maxTotal"))
          : undefined,

        createdFrom: searchParams.get("createdFrom") ?? undefined,

        createdTo: searchParams.get("createdTo") ?? undefined,
      };
      console.log("result  ===> ", query);

      const result = await orderService.getAllOrders(query);

      return successResponse("Orders retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
