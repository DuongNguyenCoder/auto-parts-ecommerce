import { handleApiError, successResponse } from "@/server/http/api-response";
import { postCategoryService } from "@/server/services/post-categories.service";
import {
  createPostCategorySchema,
  updatePostCategorySchema,
} from "@/validations/post-categories.schema";
import type { NextRequest } from "next/server";

export const postCategoryController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createPostCategorySchema.parse(await request.json());
      const result = await postCategoryService.create(payload);
      return successResponse("Post category created successfully", result, 201);
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

      const result = await postCategoryService.list({ name }, { take, skip });
      return successResponse("Post categories retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await postCategoryService.getById(parseInt(id));
      return successResponse("Post category retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updatePostCategorySchema.parse(await request.json());
      const result = await postCategoryService.update(parseInt(id), payload);
      return successResponse("Post category updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await postCategoryService.delete(parseInt(id));
      return successResponse("Post category deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
