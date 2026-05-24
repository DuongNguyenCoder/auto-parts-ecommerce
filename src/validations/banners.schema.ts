import { z } from 'zod';

export const createBannerSchema = z.object({
  title: z.string().trim().max(200).optional(),
  imageUrl: z.string().url(),
  link: z.string().url().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateBannerSchema = createBannerSchema.partial();

export type CreateBannerDTO = z.infer<typeof createBannerSchema>;
export type UpdateBannerDTO = z.infer<typeof updateBannerSchema>;
