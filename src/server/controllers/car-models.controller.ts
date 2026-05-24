import {
  createCarModelSchema,
  updateCarModelSchema,
} from "@/validations/car-models.schema";
import type { NextRequest } from "next/server";
import { handleApiError, successResponse } from "../http/api-response";
import { carModelService } from "../services/car-models.service";

export const carModelController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createCarModelSchema.parse(await request.json());
      const result = await carModelService.create(payload);
      return successResponse("Car model created successfully", result, 201);
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
      const brandId = url.searchParams.get("brandId")
        ? parseInt(url.searchParams.get("brandId")!)
        : undefined;
      const name = url.searchParams.get("name") || undefined;

      const result = await carModelService.list(
        { brandId, name },
        { take, skip },
      );
      return successResponse("Car models retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await carModelService.getById(parseInt(id));
      return successResponse("Car model retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateCarModelSchema.parse(await request.json());
      const result = await carModelService.update(parseInt(id), payload);
      return successResponse("Car model updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await carModelService.delete(parseInt(id));
      return successResponse("Car model deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
