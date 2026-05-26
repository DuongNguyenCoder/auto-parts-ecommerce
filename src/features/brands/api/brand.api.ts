import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateBrandDTO,
  UpdateBrandDTO,
} from "@/validations/brands.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, Brand, BrandListQuery, PaginatedData } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const brandApi = {
  getAll: async (
    query?: BrandListQuery,
  ): Promise<ApiResponse<PaginatedData<Brand>>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/brands?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["brands"],
        },
      },
    );

    return parseResponse<PaginatedData<Brand>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<Brand>> => {
    const response = await fetch(`${getBaseUrl()}/api/brands/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["brands", `brand-${id}`],
      },
    });

    return parseResponse<Brand>(response);
  },

  create: async (payload: CreateBrandDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/brands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Brand>(response);
  },

  update: async (id: number, payload: UpdateBrandDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/brands/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Brand>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/brands/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<Brand>(response);
  },
};
