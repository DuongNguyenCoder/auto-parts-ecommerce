import { AppError } from "@/server/http/app-error";
import { carModelRepository } from "@/server/repositories/car-models.repository";
import { categoryRepository } from "@/server/repositories/categories.repository";
import { productRepository } from "@/server/repositories/products.repository";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/validations/products.schema";

const ensureCategoryExists = async (categoryId: number) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) throw new AppError("Category not found", 404);
};

const ensureFitmentsExist = async (fitmentIds?: number[]) => {
  if (!fitmentIds?.length) return;

  const uniqueIds = Array.from(new Set(fitmentIds));
  const fitments = await carModelRepository.findByIds(uniqueIds);
  const existingIds = new Set(fitments.map((fitment) => fitment.id));
  const hasMissingFitment = uniqueIds.some((id) => !existingIds.has(id));

  if (hasMissingFitment) throw new AppError("Car model not found", 404);
};

export const productService = {
  getById: async (id: number) => {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    return product;
  },

  getBySlug: async (slug: string) => {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new AppError("Product not found", 404);
    return product;
  },

  list: async (
    filters?: { name?: string; categoryId?: number; carModelId?: number },
    pagination?: { take?: number; skip?: number },
  ) => {
    return productRepository.findMany(filters, pagination);
  },

  create: async (data: CreateProductDTO) => {
    const existing = await productRepository.findBySlug(data.slug);
    if (existing) throw new AppError("Product slug already exists", 409);

    await ensureCategoryExists(data.categoryId);
    await ensureFitmentsExist(data.fitmentIds);

    return productRepository.create(data);
  },

  update: async (id: number, data: UpdateProductDTO) => {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError("Product not found", 404);

    if (data.slug && data.slug !== product.slug) {
      const existing = await productRepository.findBySlug(data.slug);
      if (existing) throw new AppError("Product slug already exists", 409);
    }

    if (data.categoryId) await ensureCategoryExists(data.categoryId);
    await ensureFitmentsExist(data.fitmentIds);

    return productRepository.update(id, data);
  },

  delete: async (id: number) => {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError("Product not found", 404);
    return productRepository.delete(id);
  },
};
