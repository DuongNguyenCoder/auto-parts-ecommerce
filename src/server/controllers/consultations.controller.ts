import {
  createConsulationSchema,
  updateConsulationSchema,
} from "@/validations/consulations.schema";
import type { NextRequest } from "next/server";
import { consultationService } from "../services/consultations.service";
import { handleApiError, successResponse } from "../http/api-response";

export const consultationController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createConsulationSchema.parse(await request.json());
      const result = await consultationService.create(payload);
      return successResponse("Consultation created successfully", result, 201);
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
      const status = url.searchParams.get("status") as any;
      const search = url.searchParams.get("search") || undefined;

      const result = await consultationService.list(
        { status, search },
        { take, skip },
      );
      return successResponse("Consultations retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await consultationService.getById(parseInt(id));
      return successResponse("Consultation retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateConsulationSchema.parse(await request.json());
      const result = await consultationService.update(parseInt(id), payload);
      return successResponse("Consultation updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await consultationService.delete(parseInt(id));
      return successResponse("Consultation deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
