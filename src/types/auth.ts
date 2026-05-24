import type { Role } from "@/../prisma/generated/prisma";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  createdAt?: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthFormState = {
  isLoading: boolean;
  error: string | null;
};
