import { handleApiError, successResponse } from "@/server/http/api-response";
import { productService } from "@/server/services/products.service";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validations/products.schema";
import type { NextRequest } from "next/server";

export const productController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createProductSchema.parse(await request.json());
      const result = await productService.create(payload);
      return successResponse("Product created successfully", result, 201);
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
      const categoryId = url.searchParams.get("categoryId")
        ? parseInt(url.searchParams.get("categoryId")!)
        : undefined;
      const carModelId = url.searchParams.get("carModelId")
        ? parseInt(url.searchParams.get("carModelId")!)
        : undefined;
      const sortBy = url.searchParams.get("sortBy") || undefined;
      const orderBy = url.searchParams.get("orderBy") as
        | "asc"
        | "desc"
        | undefined;

      const result = await productService.list(
        { name, categoryId, carModelId },
        { take, skip },
        { sortBy, orderBy },
      );
      return successResponse("Products retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await productService.getById(parseInt(id));
      return successResponse("Product retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getBySlug: async (request: NextRequest, { slug }: { slug: string }) => {
    try {
      const result = await productService.getBySlug(slug);
      return successResponse("Product retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateProductSchema.parse(await request.json());
      const result = await productService.update(parseInt(id), payload);
      return successResponse("Product updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await productService.delete(parseInt(id));
      return successResponse("Product deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
