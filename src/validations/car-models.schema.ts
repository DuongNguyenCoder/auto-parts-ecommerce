import { z } from "zod";

export const createCarModelSchema = z.object({
  brandId: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  year: z.string().trim().max(50).optional(),
});

export const updateCarModelSchema = createCarModelSchema.partial();

export type CreateCarModelDTO = z.infer<typeof createCarModelSchema>;
export type UpdateCarModelDTO = z.infer<typeof updateCarModelSchema>;
