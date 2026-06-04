import { getBaseUrl } from "@/lib/getBaseUrl";
import type {
  AddWishlistItemDTO,
  SyncWishlistDTO,
} from "@/validations/wishlist.schema";
import type { ApiResponse, WishlistItem } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const wishlistApi = {
  getList: async (): Promise<ApiResponse<WishlistItem[]>> => {
    const response = await fetch(`/api/wishlist`, {
      method: "GET",
      credentials: "include",
      next: {
        revalidate: 60,
        tags: ["wishlist"],
      },
    });

    return parseResponse<WishlistItem[]>(response);
  },

  addItem: async (payload: AddWishlistItemDTO) => {
    const response = await fetch(`/api/wishlist`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<WishlistItem>(response);
  },

  removeItem: async (id: string) => {
    const response = await fetch(`/api/wishlist/${id}/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    return parseResponse<WishlistItem>(response);
  },

  syncWishlist: async (payload: SyncWishlistDTO) => {
    const response = await fetch(`/api/wishlist/sync`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<WishlistItem[]>(response);
  },
};
