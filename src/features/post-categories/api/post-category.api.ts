import { createSearchParams } from "@/lib/create-search-params";
import { getBaseUrl } from "@/lib/getBaseUrl";
import {
  ApiResponse,
  PaginatedData,
  PostCategory,
  PostCategoryListQuery,
} from "@/types";

import type {
  CreatePostCategoryDTO,
  UpdatePostCategoryDTO,
} from "@/validations/post-categories.schema";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const postCategoryApi = {
  getAll: async (
    query?: PostCategoryListQuery,
  ): Promise<ApiResponse<PaginatedData<PostCategory>>> => {
    const params = createSearchParams(query);
    const response = await fetch(`/api/post-categories?${params.toString()}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["post-categories"],
      },
    });

    return parseResponse<PaginatedData<PostCategory>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<PostCategory>> => {
    const response = await fetch(`/api/post-categories/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["post-categories", `post-category-${id}`],
      },
    });

    return parseResponse<PostCategory>(response);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<PostCategory>> => {
    const response = await fetch(`/api/post-categories/slug/${slug}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["post-categories", `post-category-${slug}`],
      },
    });

    return parseResponse<PostCategory>(response);
  },

  create: async (payload: CreatePostCategoryDTO) => {
    const response = await fetch(`/api/post-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<PostCategory>(response);
  },

  update: async (id: number, payload: UpdatePostCategoryDTO) => {
    const response = await fetch(`/api/post-categories/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<PostCategory>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`/api/post-categories/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<PostCategory>(response);
  },
};
