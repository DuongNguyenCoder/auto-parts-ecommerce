import { CreateBannerDTO, UpdateBannerDTO } from "@/validations/banners.schema";
import { AppError } from "../http/app-error";
import { bannerRepository } from "../repositories/banners.repository";
import { buildPagination } from "@/server/utils/pagination";

export const bannerService = {
  getById: async (id: number) => {
    const banner = await bannerRepository.findById(id);
    if (!banner) throw new AppError("Banner not found", 404);
    return banner;
  },

  getActive: async (pagination?: { take?: number; skip?: number }) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      bannerRepository.findActive({ take, skip }),
      bannerRepository.count({ isActive: true }),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
  },

  list: async (
    filters?: { isActive?: boolean },
    pagination?: { take?: number; skip?: number },
  ) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      bannerRepository.findMany(filters, { take, skip }),
      bannerRepository.count(filters),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
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
