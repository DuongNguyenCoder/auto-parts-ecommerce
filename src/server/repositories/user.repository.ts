import { prisma } from "../prisma";
import type { Role } from "@/../prisma/generated/prisma";

const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

const authUserSelect = {
  ...publicUserSelect,
  password: true,
} as const;

export type PublicUserRecord = Awaited<
  ReturnType<typeof userRepository.findPublicById>
>;
export type AuthUserRecord = Awaited<
  ReturnType<typeof userRepository.findAuthByEmail>
>;

export const userRepository = {
  findPublicById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    }),

  findPublicByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    }),

  findAuthByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      select: authUserSelect,
    }),

  create: (data: { email: string; password: string; role?: Role }) =>
    prisma.user.create({
      data,
      select: publicUserSelect,
    }),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    }),

  findMany: (
    filters?: { email?: string; role?: Role },
    pagination?: { take?: number; skip?: number },
  ) =>
    prisma.user.findMany({
      where: {
        email: filters?.email
          ? { contains: filters.email, mode: "insensitive" }
          : undefined,
        role: filters?.role,
      },
      orderBy: { createdAt: "desc" },
      take: pagination?.take,
      skip: pagination?.skip,
      select: publicUserSelect,
    }),

  update: (
    id: string,
    data: { email?: string; password?: string; role?: Role },
  ) =>
    prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    }),

  delete: (id: string) =>
    prisma.user.delete({
      where: { id },
      select: publicUserSelect,
    }),

  count: (where?: { email?: string; role?: Role }) =>
    prisma.user.count({
      where: {
        email: where?.email
          ? { contains: where.email, mode: "insensitive" }
          : undefined,
        role: where?.role,
      },
    }),
};
