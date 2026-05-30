import type { NextRequest } from "next/server";
import { handleApiError, successResponse } from "@/server/http/api-response";
import { wishlistService } from "@/server/services/wishlist.service";
import {
  addWishlistItemSchema,
  syncWishlistSchema,
} from "@/validations/wishlist.schema";

export const wishlistController = {
  getList: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const result = await wishlistService.getListByUserId(userId);
      return successResponse("Wishlist retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  addItem: async (request: NextRequest, { userId }: { userId: string }) => {
    try {
      const payload = addWishlistItemSchema.parse(await request.json());
      const result = await wishlistService.addItem(userId, payload);
      return successResponse("Wishlist item added successfully", result, 201);
    } catch (error) {
      return handleApiError(error);
    }
  },

  removeItem: async (
    request: NextRequest,
    { id, userId }: { id: string; userId: string },
  ) => {
    try {
      const result = await wishlistService.removeItem(userId, id);
      return successResponse("Wishlist item removed successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  syncWishlist: async (
    request: NextRequest,
    { userId }: { userId: string },
  ) => {
    try {
      const body = await request.json();
      const payload = syncWishlistSchema.parse(body);
      const result = await wishlistService.syncWishlist(userId, payload);
      return successResponse("Wishlist synced successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
