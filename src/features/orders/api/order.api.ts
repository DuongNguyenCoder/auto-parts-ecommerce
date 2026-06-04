import { getBaseUrl } from "@/lib/getBaseUrl";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
} from "@/validations/order.schema";
import type {
  ApiResponse,
  Order,
  OrderListQuery,
  PaginatedData,
} from "@/types";
import { createSearchParams } from "@/lib/create-search-params";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const orderApi = {
  getAllByAdmin: async (
    query: OrderListQuery,
  ): Promise<ApiResponse<PaginatedData<Order>>> => {
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
    const response = await fetch(`/api/orders/admin?${params.toString()}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["orders"],
      },
    });
    console.log("Check order API Hook =====> ");
    return parseResponse<PaginatedData<Order>>(response);
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "GET",
      credentials: "include",
    });

    return parseResponse<Order>(response);
  },

  createOrder: async (payload: CreateOrderDTO): Promise<ApiResponse<Order>> => {
    const response = await fetch(`/api/orders`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Order>(response);
  },

  updateOrder: async (
    id: string,
    payload: UpdateOrderDTO,
  ): Promise<ApiResponse<Order>> => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<Order>(response);
  },
};
