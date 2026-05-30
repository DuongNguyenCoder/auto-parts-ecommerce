import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().trim().optional(),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export const syncCartItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().trim(),
  quantity: z.number().int().positive(),
});

export const syncCartSchema = z.object({
  items: z.array(syncCartItemSchema),
});

export type AddCartItemDTO = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
export type SyncCartItemDTO = z.infer<typeof syncCartItemSchema>;
export type SyncCartDTO = z.infer<typeof syncCartSchema>;
