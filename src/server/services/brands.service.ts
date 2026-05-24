import { CreateBrandDTO, UpdateBrandDTO } from "@/validations/brands.schema";
import { AppError } from "../http/app-error";
import { brandRepository } from "../repositories/brands.repository";

export const brandService = {
  getById: async (id: number) => {
    const brand = await brandRepository.findById(id);
    if (!brand) throw new AppError("Brand not found", 404);
    return brand;
  },

  list: async (
    filters?: { name?: string },
    pagination?: { take?: number; skip?: number },
  ) => {
    return brandRepository.findMany(filters, pagination);
  },

  create: async (data: CreateBrandDTO) => {
    const existing = await brandRepository.findMany(
      { name: data.name },
      { take: 1 },
    );
    if (existing.length > 0) throw new AppError("Brand already exists", 409);
    return brandRepository.create(data);
  },

  update: async (id: number, data: UpdateBrandDTO) => {
    const brand = await brandRepository.findById(id);
    if (!brand) throw new AppError("Brand not found", 404);
    return brandRepository.update(id, data);
  },

  delete: async (id: number) => {
    const brand = await brandRepository.findById(id);
    if (!brand) throw new AppError("Brand not found", 404);
    return brandRepository.delete(id);
  },
};
