import { createSearchParams } from "@/lib/create-search-params";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { AuthSession } from "@/types/auth";
import type { CreateUserDTO, UpdateUserDTO } from "@/validations/users.schema";
import { ApiResponse, PaginatedData, User, UserListQuery } from "@/types";
import type { LoginInput, RegisterInput } from "@/validations/auth.schema";

const parseResponse = async <T>(response: Response) => {
  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !data?.success) {
    throw new Error(data?.message ?? "Unable to process request.");
  }
  return data;
};

export const userApi = {
  getSession: async (): Promise<ApiResponse<AuthSession>> => {
    const response = await fetch(`${getBaseUrl()}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      next: {
        revalidate: 300,
        tags: ["auth"],
      },
    });

    return parseResponse<AuthSession>(response);
  },

  login: async (payload: LoginInput) => {
    const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<AuthSession>(response);
  },

  register: async (payload: RegisterInput) => {
    const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<AuthSession>(response);
  },

  logout: async () => {
    const response = await fetch(`${getBaseUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return parseResponse<null>(response);
  },

  getAll: async (
    query?: UserListQuery,
  ): Promise<ApiResponse<PaginatedData<User>>> => {
    const params = createSearchParams(query);
    const response = await fetch(
      `${getBaseUrl()}/api/users?${params.toString()}`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["users"],
        },
      },
    );

    return parseResponse<PaginatedData<User>>(response);
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${getBaseUrl()}/api/users/${id}`, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["users", `user-${id}`],
      },
    });

    return parseResponse<User>(response);
  },

  create: async (payload: CreateUserDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<User>(response);
  },

  update: async (id: string, payload: UpdateUserDTO) => {
    const response = await fetch(`${getBaseUrl()}/api/users/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return parseResponse<User>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${getBaseUrl()}/api/users/${id}/delete`, {
      method: "DELETE",
    });

    return parseResponse<User>(response);
  },
};
