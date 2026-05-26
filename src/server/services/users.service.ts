import type { Role } from "@/../prisma/generated/prisma";
import { hashPassword } from "@/server/auth/password";
import { AppError } from "@/server/http/app-error";
import { buildPagination } from "@/server/utils/pagination";
import { userRepository } from "@/server/repositories/user.repository";
import type { CreateUserDTO, UpdateUserDTO } from "@/validations/users.schema";

export const userService = {
  list: async (
    filters?: { email?: string; role?: Role },
    pagination?: { take?: number; skip?: number },
  ) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      userRepository.findMany(filters, { take, skip }),
      userRepository.count(filters),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
  },

  getById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },

  create: async (data: CreateUserDTO) => {
    const existing = await userRepository.findPublicByEmail(data.email);
    if (existing) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);
    return userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });
  },

  update: async (id: string, data: UpdateUserDTO) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findPublicByEmail(data.email);
      if (existing) {
        throw new AppError("Email already exists", 409);
      }
    }

    const payload: {
      email?: string;
      role?: Role;
      password?: string;
    } = {
      email: data.email,
      role: data.role,
    };

    if (data.password) {
      payload.password = await hashPassword(data.password);
    }

    return userRepository.update(id, payload);
  },

  delete: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return userRepository.delete(id);
  },
};
