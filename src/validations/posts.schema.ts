import { z } from "zod";

const postStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().toLowerCase().min(1).max(150),
  content: z.string().trim().min(1),
  excerpt: z.string().trim().max(500).optional(),
  thumbnail: z.string().trim().url().optional(),
  status: postStatusSchema.optional(),
  publishedAt: z.coerce.date().optional(),
  metaTitle: z.string().trim().max(255).optional(),
  metaDesc: z.string().trim().max(500).optional(),
  postCategoryId: z.number().int().positive().optional(),
  relatedProductIds: z.array(z.number().int().positive()).default([]),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostDTO = z.infer<typeof createPostSchema>;
export type UpdatePostDTO = z.infer<typeof updatePostSchema>;
