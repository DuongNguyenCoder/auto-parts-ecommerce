import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/validations/products.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, ProductListQuery, Product, PaginatedData } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }

  return data;
};

export const productApi = {
  getAll: async (
    query?: ProductListQuery,
  ): Promise<ApiResponse<PaginatedData<Product>>> => {
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

    return parseResponse<PaginatedData<Product>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["products", `product-${id}`],
      },
    });

    return parseResponse<Product>(response);
  },

  create: async (payload: CreateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Product>(response);
  },

  update: async (id: number, payload: UpdateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Product>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<null>(response);
  },
};
