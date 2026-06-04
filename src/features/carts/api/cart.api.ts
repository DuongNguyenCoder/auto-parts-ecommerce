import { getBaseUrl } from "@/lib/getBaseUrl";
import type {
  AddCartItemDTO,
  UpdateCartItemDTO,
  SyncCartDTO,
} from "@/validations/cart.schema";
import type { ApiResponse, Cart } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const cartApi = {
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await fetch(`/api/carts`, {
      method: "GET",
      credentials: "include",
      next: {
        revalidate: 60,
        tags: ["cart"],
      },
    });

    return parseResponse<Cart>(response);
  },

  addItem: async (payload: AddCartItemDTO) => {
    const response = await fetch(`/api/carts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Cart>(response);
  },

  updateItem: async (id: number, payload: UpdateCartItemDTO) => {
    const response = await fetch(`/api/carts/items/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Cart>(response);
  },

  removeItem: async (id: number) => {
    const response = await fetch(`/api/carts/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return parseResponse<Cart>(response);
  },

  syncCart: async (payload: SyncCartDTO) => {
    const response = await fetch(`/api/carts/sync`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Cart>(response);
  },
};
