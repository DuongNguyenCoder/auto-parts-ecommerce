import { handleApiError, successResponse } from "@/server/http/api-response";
import { postService } from "@/server/services/posts.service";
import { createPostSchema, updatePostSchema } from "@/validations/posts.schema";
import type { NextRequest } from "next/server";
import type { PostStatus } from "../../../prisma/generated/prisma/client";

export const postController = {
  create: async (request: NextRequest, { authorId }: { authorId: string }) => {
    try {
      const payload = createPostSchema.parse(await request.json());
      const result = await postService.create(authorId, payload);
      return successResponse("Post created successfully", result, 201);
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
      const title = url.searchParams.get("title") || undefined;
      const status = (url.searchParams.get("status") || undefined) as
        | PostStatus
        | undefined;
      const postCategoryId = url.searchParams.get("postCategoryId")
        ? parseInt(url.searchParams.get("postCategoryId")!)
        : undefined;
      const authorId = url.searchParams.get("authorId") || undefined;

      const result = await postService.list(
        { title, status, postCategoryId, authorId },
        { take, skip },
      );
      return successResponse("Posts retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getBySlug: async (request: NextRequest, { slug }: { slug: string }) => {
    try {
      const result = await postService.getBySlug(slug);
      return successResponse("Post retrieved successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  update: async (request: NextRequest, { slug }: { slug: string }) => {
    try {
      const payload = updatePostSchema.parse(await request.json());
      const result = await postService.update(slug, payload);
      return successResponse("Post updated successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },

  delete: async (request: NextRequest, { slug }: { slug: string }) => {
    try {
      const result = await postService.delete(slug);
      return successResponse("Post deleted successfully", result);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
