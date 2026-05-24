import { handleApiError, successResponse } from "@/server/http/api-response";
import { categoryService } from "@/server/services/categories.service";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/validations/categories.schema";
import type { NextRequest } from "next/server";

export const categoryController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createCategorySchema.parse(await request.json());
      const result = await categoryService.create(payload);
      return successResponse("Category created successfully", result, 201);
    } catch (error) {
      return handleApiError(error);
    }
  },

  list: async (request: NextRequest) => {
    try {
      const url = new URL(request.url);
      const take = url.searchParams.get("take")
        ? parseInt(url.searchParams.get("take")!)
        : 10;
      const skip = url.searchParams.get("skip")
        ? parseInt(url.searchParams.get("skip")!)
        : 0;
      const name = url.searchParams.get("name") || undefined;

      const result = await categoryService.list({ name }, { take, skip });
      return successResponse("Categories retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await categoryService.getById(parseInt(id));
      return successResponse("Category retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateCategorySchema.parse(await request.json());
      const result = await categoryService.update(parseInt(id), payload);
      return successResponse("Category updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await categoryService.delete(parseInt(id));
      return successResponse("Category deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
