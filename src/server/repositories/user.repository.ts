import { prisma } from "@/src/server/prisma";

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

  create: (data: { email: string; password: string }) =>
    prisma.user.create({
      data,
      select: publicUserSelect,
    }),
};
