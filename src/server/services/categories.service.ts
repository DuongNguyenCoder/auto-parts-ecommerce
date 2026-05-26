import { AppError } from "@/server/http/app-error";
import { categoryRepository } from "@/server/repositories/categories.repository";
import { buildPagination } from "@/server/utils/pagination";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/validations/categories.schema";

export const categoryService = {
  getById: async (id: number) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  },

  getBySlug: async (slug: string) => {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  },

  list: async (
    filters?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      categoryRepository.findMany(filters, { take, skip }),
      categoryRepository.count(filters),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
  },

  create: async (data: CreateCategoryDTO) => {
    const existing = await categoryRepository.findBySlug(data.slug);
    if (existing) throw new AppError("Category slug already exists", 409);
    return categoryRepository.create(data);
  },

  update: async (id: number, data: UpdateCategoryDTO) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError("Category not found", 404);

    if (data.slug && data.slug !== category.slug) {
      const existing = await categoryRepository.findBySlug(data.slug);
      if (existing) throw new AppError("Category slug already exists", 409);
    }

    return categoryRepository.update(id, data);
  },

  delete: async (id: number) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError("Category not found", 404);
    return categoryRepository.delete(id);
  },
};
