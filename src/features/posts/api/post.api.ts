import { createSearchParams } from "@/lib/create-search-params";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { CreatePostDTO, UpdatePostDTO } from "@/validations/posts.schema";
import { ApiResponse, PaginatedData, Post, PostListQuery } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const postApi = {
  getAll: async (
    query?: PostListQuery,
  ): Promise<ApiResponse<PaginatedData<Post>>> => {
    const params = createSearchParams(query);
    const response = await fetch(`/api/posts?${params.toString()}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["posts"],
      },
    });

    return parseResponse<PaginatedData<Post>>(response);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Post>> => {
    const response = await fetch(`/api/posts/${slug}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["posts", `post-${slug}`],
      },
    });

    return parseResponse<Post>(response);
  },

  create: async (payload: CreatePostDTO) => {
    const response = await fetch(`/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Post>(response);
  },

  update: async (slug: string, payload: UpdatePostDTO) => {
    const response = await fetch(`/api/posts/${slug}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Post>(response);
  },

  delete: async (slug: string) => {
    const response = await fetch(`/api/posts/${slug}/delete`, {
      method: "DELETE",
    });

    return parseResponse<Post>(response);
  },
};
