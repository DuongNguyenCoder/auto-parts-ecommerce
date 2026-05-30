"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthSession } from "@/types/auth";
import type { LoginInput, RegisterInput } from "@/validations/auth.schema";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth-endpoints";
import { getBaseUrl } from "@/lib/getBaseUrl";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

const authQueryKey = ["auth", "me"] as const;

const parseApiResponse = async <T>(response: Response) => {
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data as T;
};

const postAuth = async <TBody, TResult>(url: string, body?: TBody) => {
  const response = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseApiResponse<TResult>(response);
};

const getSession = async () => {
  const response = await fetch(AUTH_ENDPOINTS.me, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  return parseApiResponse<AuthSession>(response);
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: getSession,
    retry: false,
    staleTime: 60000,
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) =>
      postAuth<RegisterInput, AuthSession>(
        `${getBaseUrl()}${AUTH_ENDPOINTS.register}`,
        input,
      ),
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKey, session);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) =>
      postAuth<LoginInput, AuthSession>(AUTH_ENDPOINTS.login, input),
    onSuccess: (session) => {
      queryClient.setQueryData(authQueryKey, session);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => postAuth<undefined, null>(AUTH_ENDPOINTS.logout),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null);
    },
  });

  return {
    session: sessionQuery.data ?? null,
    user: sessionQuery.data?.user ?? null,
    isAuthenticated: Boolean(sessionQuery.data?.user),
    isSessionLoading: sessionQuery.isLoading,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    authError:
      registerMutation.error?.message ??
      loginMutation.error?.message ??
      logoutMutation.error?.message ??
      sessionQuery.error?.message ??
      null,
  };
};
