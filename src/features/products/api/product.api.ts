import { createSearchParams } from "@/lib/create-search-params";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/validations/products.schema";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { ApiResponse, ProductListQuery, Product, PaginatedData } from "@/types";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }

  return data;
};

export const productApi = {
  getAll: async (query?: ProductListQuery) => {
    // convert page -> take/skip if page provided; always send take & skip
    const take = query?.take ?? 10;
    let skip = query?.skip ?? 0;

    if (query?.page) {
      skip = (query.page - 1) * take;
    }

    // build params but omit `page`
    const paramsObj: Record<string, any> = { ...(query ?? {}) };
    paramsObj.take = take;
    paramsObj.skip = skip;
    delete paramsObj.page;

    const params = createSearchParams(paramsObj);

    const response = await fetch(
      `${getBaseUrl()}/api/products?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["products"],
        },
      },
    );

    const parsed = await parseResponse<any>(response);

    // server returns data: { items, pagination }
    const items = parsed.data?.items ?? [];
    const p = parsed.data?.pagination ?? {};

    // transform pagination key `totalPages` -> `totalpage` per requested shape
    const transformed = {
      success: parsed.success,
      message: parsed.message,
      data: items,
      pagination: {
        page: p.page ?? Math.floor((skip || 0) / (take || 10)) + 1,
        totalpage: p.totalPages ?? 1,
        totalPages: p.totalPages ?? 1,
        total: p.total ?? 0,
        take: p.take ?? take,
        skip: p.skip ?? skip,
      },
    };

    return transformed;
  },

  getById: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["products", `product-${id}`],
      },
    });

    return parseResponse<Product>(response);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${getBaseUrl()}/api/products/slug/${slug}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["products", `product-slug-${slug}`],
      },
    });

    return parseResponse<Product>(response);
  },

  create: async (payload: CreateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Product>(response);
  },

  update: async (id: number, payload: UpdateProductDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Product>(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${getBaseUrl()}/api/products/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<null>(response);
  },
};
