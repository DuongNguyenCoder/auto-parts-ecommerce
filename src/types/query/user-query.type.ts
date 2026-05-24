import type { Role } from "@/../prisma/generated/prisma";
import type { BaseListQuery } from "@/types/query/query.type";

export type UserListQuery = BaseListQuery & {
  email?: string;

  role?: Role;
};
