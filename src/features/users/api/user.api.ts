import { getBaseUrl } from "@/lib/getBaseUrl";
import type { AuthSession } from "@/types/auth";
import type { LoginInput, RegisterInput } from "@/validations/auth.schema";
import { ApiResponse } from "@/types";

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

    return response.json();
  },

  login: async (payload: LoginInput) => {
    const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  register: async (payload: RegisterInput) => {
    const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${getBaseUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return response.json();
  },
};
