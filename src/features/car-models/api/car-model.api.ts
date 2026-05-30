import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "@/validations/car-models.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import {
  ApiResponse,
  CarModel,
  CarModelListQuery,
  PaginatedData,
} from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const carModelApi = {
  getAll: async (
    query?: CarModelListQuery,
  ): Promise<ApiResponse<PaginatedData<CarModel>>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/car-models?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["car-models"],
        },
      },
    );

    return parseResponse<PaginatedData<CarModel>>(response);
  },

  getById: async (id: number): Promise<ApiResponse<CarModel>> => {
    const response = await fetch(`${getBaseUrl()}/api/car-models/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["car-models", `car-model-${id}`],
      },
    });

    return parseResponse<CarModel>(response);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<CarModel>> => {
    const response = await fetch(
      `${getBaseUrl()}/api/car-models/slug/${slug}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["car-models", `car-model-slug-${slug}`],
        },
      },
    );

    return parseResponse<CarModel>(response);
  },

  create: async (payload: CreateCarModelDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/car-models`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<CarModel>(response);
  },

  update: async (id: number, payload: UpdateCarModelDTO) => {
    const response = await fetch(
      `${getBaseUrl()}/api/car-models/${id}/update`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    return parseResponse<CarModel>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(
      `${getBaseUrl()}/api/car-models/${id}/delete`,
      {
        method: "DELETE",
      },
    );

    return parseResponse<CarModel>(response);
  },
};
