import {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "@/validations/car-models.schema";
import { AppError } from "../http/app-error";
import { brandRepository } from "../repositories/brands.repository";
import { carModelRepository } from "../repositories/car-models.repository";

export const carModelService = {
  getById: async (id: number) => {
    const model = await carModelRepository.findById(id);
    if (!model) throw new AppError("Car model not found", 404);
    return model;
  },

  getByBrand: async (
    brandId: number,
    pagination?: { take?: number; skip?: number },
  ) => {
    const brand = await brandRepository.findById(brandId);
    if (!brand) throw new AppError("Brand not found", 404);
    return carModelRepository.findByBrand(brandId, pagination);
  },

  list: async (
    filters?: { brandId?: number; name?: string },
    pagination?: { take?: number; skip?: number },
  ) => {
    return carModelRepository.findMany(filters, pagination);
  },

  create: async (data: CreateCarModelDTO) => {
    const brand = await brandRepository.findById(data.brandId);
    if (!brand) throw new AppError("Brand not found", 404);
    return carModelRepository.create(data);
  },

  update: async (id: number, data: UpdateCarModelDTO) => {
    const model = await carModelRepository.findById(id);
    if (!model) throw new AppError("Car model not found", 404);

    if (data.brandId) {
      const brand = await brandRepository.findById(data.brandId);
      if (!brand) throw new AppError("Brand not found", 404);
    }

    return carModelRepository.update(id, data);
  },

  delete: async (id: number) => {
    const model = await carModelRepository.findById(id);
    if (!model) throw new AppError("Car model not found", 404);
    return carModelRepository.delete(id);
  },
};
