// validations/products-query.schema.ts

import { z } from "zod";

export const baseQuerySchema = z.object({
  take: z.coerce.number().int().positive().default(10),

  skip: z.coerce.number().int().min(0).default(0),

  keyword: z.string().optional(),

  categoryId: z.coerce.number().optional(),

  featured: z.coerce.boolean().optional(),

  status: z.enum(["ACTIVE", "DRAFT"]).optional(),
});

export type BaseQuery = z.infer<typeof baseQuerySchema>;
