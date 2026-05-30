import type { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/server/http/api-response";
import { cartService } from "@/server/services/carts.service";
import {
  addCartItemSchema,
  updateCartItemSchema,
  syncCartSchema,
} from "@/validations/cart.schema";

export const cartsController = {
  getCart: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const result = await cartService.getCartByUserId(userId);
      return successResponse("Cart retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  addItem: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const body = await request.json();
      console.log("Trying to add item to cart => ", { userId }, body);
      const payload = addCartItemSchema.parse(body);
      const result = await cartService.addItem(userId, payload);
      return successResponse("Cart item added successfully", result, 201);
    } catch (error) {
      console.log("errrore when adding", error);
      return handleApiError(error);
    }
  },

  updateItem: async (
    request: NextRequest,
    { id, userId }: { id: string; userId: string },
  ) => {
    try {
      const payload = updateCartItemSchema.parse(await request.json());
      const result = await cartService.updateItem(
        userId,
        parseInt(id, 10),
        payload,
      );
      return successResponse("Cart item updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  removeItem: async (
    request: NextRequest,
    { id, userId }: { id: string; userId: string },
  ) => {
    try {
      const result = await cartService.removeItem(userId, parseInt(id, 10));
      return successResponse("Cart item removed successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  syncCart: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const body = await request.json();
      const payload = syncCartSchema.parse(body);
      const result = await cartService.syncCart(userId, payload);
      console.log("helllo con vợ của anh");
      return successResponse("Cart synced successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
