import { z } from "zod";

export const addWishlistItemSchema = z.object({
  productId: z.number().int().positive(),
});

export const syncWishlistItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().trim(),
});

export const syncWishlistSchema = z.object({
  items: z.array(syncWishlistItemSchema),
});

export type AddWishlistItemDTO = z.infer<typeof addWishlistItemSchema>;
export type SyncWishlistItemDTO = z.infer<typeof syncWishlistItemSchema>;
export type SyncWishlistDTO = z.infer<typeof syncWishlistSchema>;
