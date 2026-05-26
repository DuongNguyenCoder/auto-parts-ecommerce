import { z } from "zod";
import {
  createPostSchema,
  type CreatePostDTO,
  type UpdatePostDTO,
} from "@/validations/posts.schema";
import type { PostCategory, Post } from "@/types";

export type { PostCategory } from "@/types";

export const postFormSchema = createPostSchema;

export type PostFormFields = z.input<typeof postFormSchema>;
export type PostFormOutput = z.output<typeof postFormSchema>;

export type PostFormProps = {
  initialData?: Post;
  postCategories?: PostCategory[];

  onSubmit: (values: CreatePostDTO | UpdatePostDTO) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
};
