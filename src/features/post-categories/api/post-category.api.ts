import { createSearchParams } from "@/lib/create-search-params";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, Post, PostListQuery } from "@/types";

import type {
  CreatePostCategoryDTO,
  UpdatePostCategoryDTO,
} from "@/validations/post-categories.schema";

export const postCategoryApi = {
  getAll: async (query?: PostListQuery): Promise<ApiResponse<Post[]>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/post-categories?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["post-categories"],
        },
      },
    );

    return response.json();
  },

  getById: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await fetch(`${getBaseUrl()}/api/post-categories/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["post-categories", `post-category-${id}`],
      },
    });

    return response.json();
  },

  create: async (payload: CreatePostCategoryDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/post-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  update: async (id: number, payload: UpdatePostCategoryDTO) => {
    const response = await fetch(
      `${getBaseUrl()}/api/post-categories/${id}/update`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(
      `${getBaseUrl()}/api/post-categories/${id}/delete`,
      {
        method: "DELETE",
      },
    );

    return response.json();
  },
};
