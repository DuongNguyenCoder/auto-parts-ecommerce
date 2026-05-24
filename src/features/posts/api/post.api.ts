import type { CreatePostDTO, UpdatePostDTO } from "@/validations/posts.schema";

type PostQuery = {
  take?: number;
  skip?: number;
  title?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  postCategoryId?: number;
  authorId?: string;
};

const toSearchParams = (query?: PostQuery) => {
  const params = new URLSearchParams();

  if (!query) return params;

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });

  return params;
};

export const postApi = {
  getAll: async (query?: PostQuery) => {
    const params = toSearchParams(query);
    const response = await fetch(`/api/posts?${params.toString()}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["posts"],
      },
    });

    return response.json();
  },

  getBySlug: async (slug: string) => {
    const response = await fetch(`/api/posts/${slug}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["posts", `post-${slug}`],
      },
    });

    return response.json();
  },

  create: async (payload: CreatePostDTO) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  update: async (slug: string, payload: UpdatePostDTO) => {
    const response = await fetch(`/api/posts/${slug}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  delete: async (slug: string) => {
    const response = await fetch(`/api/posts/${slug}/delete`, {
      method: "DELETE",
    });

    return response.json();
  },
};
