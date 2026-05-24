import { AppError } from "@/server/http/app-error";
import { postCategoryRepository } from "@/server/repositories/post-categories.repository";
import type {
  CreatePostCategoryDTO,
  UpdatePostCategoryDTO,
} from "@/validations/post-categories.schema";

export const postCategoryService = {
  getById: async (id: number) => {
    const category = await postCategoryRepository.findById(id);
    if (!category) throw new AppError("Post category not found", 404);
    return category;
  },

  getBySlug: async (slug: string) => {
    const category = await postCategoryRepository.findBySlug(slug);
    if (!category) throw new AppError("Post category not found", 404);
    return category;
  },

  list: async (
    filters?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) => {
    return postCategoryRepository.findMany(filters, pagination);
  },

  create: async (data: CreatePostCategoryDTO) => {
    const existing = await postCategoryRepository.findBySlug(data.slug);
    if (existing) throw new AppError("Post category slug already exists", 409);
    return postCategoryRepository.create(data);
  },

  update: async (id: number, data: UpdatePostCategoryDTO) => {
    const category = await postCategoryRepository.findById(id);
    if (!category) throw new AppError("Post category not found", 404);

    if (data.slug && data.slug !== category.slug) {
      const existing = await postCategoryRepository.findBySlug(data.slug);
      if (existing) throw new AppError("Post category slug already exists", 409);
    }

    return postCategoryRepository.update(id, data);
  },

  delete: async (id: number) => {
    const category = await postCategoryRepository.findById(id);
    if (!category) throw new AppError("Post category not found", 404);
    return postCategoryRepository.delete(id);
  },
};
