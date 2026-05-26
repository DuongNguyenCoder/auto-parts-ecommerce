import type { NextRequest } from "next/server";
import type { Role } from "@/../prisma/generated/prisma";
import { handleApiError, successResponse } from "@/server/http/api-response";
import { userService } from "@/server/services/users.service";
import { createUserSchema, updateUserSchema } from "@/validations/users.schema";

const isValidRole = (value: string): value is Role => {
  return value === "USER" || value === "ADMIN";
};

export const usersController = {
  list: async (request: NextRequest) => {
    try {
      const url = new URL(request.url);
      const take = url.searchParams.get("take")
        ? parseInt(url.searchParams.get("take")!, 10)
        : 10;
      const skip = url.searchParams.get("skip")
        ? parseInt(url.searchParams.get("skip")!, 10)
        : 0;
      const email = url.searchParams.get("email") || undefined;
      const roleParam = url.searchParams.get("role");
      const role: Role | undefined =
        roleParam && isValidRole(roleParam) ? roleParam : undefined;

      const result = await userService.list({ email, role }, { take, skip });
      return successResponse("Users retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await userService.getById(id);
      return successResponse("User retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  create: async (request: NextRequest) => {
    try {
      const payload = createUserSchema.parse(await request.json());
      const result = await userService.create(payload);
      return successResponse("User created successfully", result, 201);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateUserSchema.parse(await request.json());
      const result = await userService.update(id, payload);
      return successResponse("User updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await userService.delete(id);
      return successResponse("User deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
