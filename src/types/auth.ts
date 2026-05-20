export type AuthRole = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
  createdAt: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type AuthFormState = {
  isLoading: boolean;
  error: string | null;
};
