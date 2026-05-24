import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/validations/categories.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, Category, CategoryListQuery } from "@/types";

export const categoryApi = {
  getAll: async (query?: CategoryListQuery): Promise<ApiResponse<Category[]>> => {
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

    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await fetch(`${getBaseUrl()}/api/categories/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["categories", `category-${id}`],
      },
    });

    return response.json();
  },

  create: async (payload: CreateCategoryDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  update: async (id: number, payload: UpdateCategoryDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/categories/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/categories/${id}/delete`, {
      method: "DELETE",
    });

    return response.json();
  },
};
