import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/validations/products.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, ProductListQuery, Product } from "@/types";

export const productApi = {
  getAll: async (query?: ProductListQuery): Promise<ApiResponse<Product[]>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/products?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["products"],
        },
      },
    );

    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["products", `product-${id}`],
      },
    });

    return response.json();
  },

  create: async (payload: CreateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  update: async (id: number, payload: UpdateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/delete`, {
      method: "DELETE",
    });

    return response.json();
  },
};
