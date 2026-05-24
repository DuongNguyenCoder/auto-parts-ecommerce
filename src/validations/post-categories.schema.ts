import { z } from 'zod';

export const createPostCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().toLowerCase().min(1).max(100),
});

export const updatePostCategorySchema = createPostCategorySchema.partial();

export type CreatePostCategoryDTO = z.infer<typeof createPostCategorySchema>;
export type UpdatePostCategoryDTO = z.infer<typeof updatePostCategorySchema>;
