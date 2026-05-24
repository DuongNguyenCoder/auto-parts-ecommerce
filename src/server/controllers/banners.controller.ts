import {
  createBannerSchema,
  updateBannerSchema,
} from "@/validations/banners.schema";
import type { NextRequest } from "next/server";
import { bannerService } from "../services/banners.service";
import { handleApiError, successResponse } from "../http/api-response";

export const bannerController = {
  create: async (request: NextRequest) => {
    try {
      const payload = createBannerSchema.parse(await request.json());
      const result = await bannerService.create(payload);
      return successResponse("Banner created successfully", result, 201);
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
      const isActive =
        url.searchParams.get("isActive") === "true"
          ? true
          : url.searchParams.get("isActive") === "false"
            ? false
            : undefined;

      const result = await bannerService.list({ isActive }, { take, skip });
      return successResponse("Banners retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getActive: async (request: NextRequest) => {
    try {
      const url = new URL(request.url);
      const take = url.searchParams.get("take")
        ? parseInt(url.searchParams.get("take")!)
        : 10;
      const skip = url.searchParams.get("skip")
        ? parseInt(url.searchParams.get("skip")!)
        : 0;

      const result = await bannerService.getActive({ take, skip });
      return successResponse("Active banners retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getById: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await bannerService.getById(parseInt(id));
      return successResponse("Banner retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const payload = updateBannerSchema.parse(await request.json());
      const result = await bannerService.update(parseInt(id), payload);
      return successResponse("Banner updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { id }: { id: string }) => {
    try {
      const result = await bannerService.delete(parseInt(id));
      return successResponse("Banner deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
