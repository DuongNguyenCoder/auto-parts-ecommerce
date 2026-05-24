import { AuthUser } from "@/types";

export const isAdmin = (role?: AuthUser["role"]) => {
  return role === "ADMIN";
};
