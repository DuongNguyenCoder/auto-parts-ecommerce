import { handleApiError, successResponse } from "@/server/http/api-response";
import { brandService } from "@/server/services/brands.service";
import {
  createBrandSchema,
  updateBrandSchema,
} from "@/validations/brands.schema";
import type { NextRequest } from "next/server";

export const brandController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createBrandSchema.parse(await request.json());
      const result = await brandService.create(payload);
      return successResponse("Brand created successfully", result, 201);
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

      const result = await brandService.list({ name }, { take, skip });
      return successResponse("Brands retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await brandService.getById(parseInt(id));
      return successResponse("Brand retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getBySlug: async (request: NextRequest, { slug }: { slug: string }) => {
    try {
      const result = await brandService.getBySlug(slug);
      return successResponse("Brand retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateBrandSchema.parse(await request.json());
      const result = await brandService.update(parseInt(id), payload);
      return successResponse("Brand updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await brandService.delete(parseInt(id));
      return successResponse("Brand deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
