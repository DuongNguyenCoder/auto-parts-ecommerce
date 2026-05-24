import { createSearchParams } from "@/lib/create-search-params";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, Banner, BannerListQuery } from "@/types";

export const bannerApi = {
  getAll: async (query?: BannerListQuery): Promise<ApiResponse<Banner[]>> => {
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

    return response.json();
  },

  create: async () => {
    const response = await fetch("/api/banners", {
      method: "POST",
      next: {
        revalidate: 300,
        tags: ["banners"],
      },
    });

    return response.json();
  },
};
