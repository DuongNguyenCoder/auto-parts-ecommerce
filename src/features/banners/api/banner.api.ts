import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateBannerDTO,
  UpdateBannerDTO,
} from "@/validations/banners.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, Banner, BannerListQuery, PaginatedData } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const bannerApi = {
  getAll: async (
    query?: BannerListQuery,
  ): Promise<ApiResponse<PaginatedData<Banner>>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/banners?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["banners"],
        },
      },
    );

    return parseResponse<PaginatedData<Banner>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<Banner>> => {
    const response = await fetch(`${getBaseUrl()}/api/banners/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["banners", `banner-${id}`],
      },
    });

    return parseResponse<Banner>(response);
  },

  create: async (payload: CreateBannerDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/banners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Banner>(response);
  },

  update: async (id: number, payload: UpdateBannerDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/banners/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Banner>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/banners/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<Banner>(response);
  },
};
