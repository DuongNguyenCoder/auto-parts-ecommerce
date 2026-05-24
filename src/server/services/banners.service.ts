import { CreateBannerDTO, UpdateBannerDTO } from "@/validations/banners.schema";
import { AppError } from "../http/app-error";
import { bannerRepository } from "../repositories/banners.repository";

export const bannerService = {
  getById: async (id: number) => {
    const banner = await bannerRepository.findById(id);
    if (!banner) throw new AppError("Banner not found", 404);
    return banner;
  },

  getActive: async (pagination?: { take?: number; skip?: number }) => {
    return bannerRepository.findActive(pagination);
  },

  list: async (
    filters?: { isActive?: boolean },
    pagination?: { take?: number; skip?: number },
  ) => {
    return bannerRepository.findMany(filters, pagination);
  },

  create: async (data: CreateBannerDTO) => {
    return bannerRepository.create(data);
  },

  update: async (id: number, data: UpdateBannerDTO) => {
    const banner = await bannerRepository.findById(id);
    if (!banner) throw new AppError("Banner not found", 404);
    return bannerRepository.update(id, data);
  },

  delete: async (id: number) => {
    const banner = await bannerRepository.findById(id);
    if (!banner) throw new AppError("Banner not found", 404);
    return bannerRepository.delete(id);
  },
};
