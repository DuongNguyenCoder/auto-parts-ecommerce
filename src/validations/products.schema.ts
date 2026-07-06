import { z } from "zod";

export const createProductSchema = z.object({
  slug: z.string().trim().toLowerCase().min(1).max(150),
  name: z.string().trim().min(1).max(255),
  overview: z.string().trim().max(1000).optional(),
  imageUrl: z.string().url(),
  price: z.coerce.number().nonnegative(),
  categoryId: z.number().int().positive(),
  fitmentIds: z.array(z.number().int().positive()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
