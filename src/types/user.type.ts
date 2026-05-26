import type { Role } from "@/../prisma/generated/prisma";

export type User = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
};
