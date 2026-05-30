import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().trim().min(1).max(100),
  imageUrl: z.string().url().optional(),
  slug: z.string().trim().min(1).max(100),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandDTO = z.infer<typeof createBrandSchema>;
export type UpdateBrandDTO = z.infer<typeof updateBrandSchema>;
