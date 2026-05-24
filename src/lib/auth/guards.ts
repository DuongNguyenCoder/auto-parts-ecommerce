// src/lib/auth/guards.ts

import { AppError } from "@/server/http/app-error";
import { isAdmin } from "./permissions";
import { getSession } from "./session";

export const requireAuth = async () => {
  const session = await getSession();

  if (!session) {
    throw new AppError("Unauthorized", 401);
  }

  return session;
};

export const requireAdmin = async () => {
  const session = await getSession();

  if (!isAdmin(session?.user?.role)) {
    throw new AppError("Forbidden", 403);
  }

  return session;
};
