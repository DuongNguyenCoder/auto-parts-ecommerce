import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/validations/categories.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import {
  ApiResponse,
  Category,
  CategoryListQuery,
  PaginatedData,
} from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const categoryApi = {
  getAll: async (
    query?: CategoryListQuery,
  ): Promise<ApiResponse<PaginatedData<Category>>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/categories?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["categories"],
        },
      },
    );

    return parseResponse<PaginatedData<Category>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${getBaseUrl()}/api/categories/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["categories", `category-${id}`],
      },
    });

    return parseResponse<Category>(response);
  },

  create: async (payload: CreateCategoryDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Category>(response);
  },

  update: async (id: number, payload: UpdateCategoryDTO) => {
    const response = await fetch(
      `${getBaseUrl()}/api/categories/${id}/update`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    return parseResponse<Category>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(
      `${getBaseUrl()}/api/categories/${id}/delete`,
      {
        method: "DELETE",
      },
    );

    return parseResponse<Category>(response);
  },
};
