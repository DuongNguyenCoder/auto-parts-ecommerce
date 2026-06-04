import { AppError } from "@/server/http/app-error";
import { postCategoryRepository } from "@/server/repositories/post-categories.repository";
import { postRepository } from "@/server/repositories/posts.repository";
import { buildPagination } from "@/server/utils/pagination";
import { productRepository } from "@/server/repositories/products.repository";
import type { CreatePostDTO, UpdatePostDTO } from "@/validations/posts.schema";
import type { PostStatus } from "../../../prisma/generated/prisma/client";
import { serialize } from "@/server/utils/serialize";

const ensurePostCategoryExists = async (postCategoryId?: number) => {
  if (!postCategoryId) return;

  const category = await postCategoryRepository.findById(postCategoryId);
  if (!category) throw new AppError("Post category not found", 404);
};

const ensureRelatedProductsExist = async (relatedProductIds?: number[]) => {
  if (!relatedProductIds?.length) return;

  const uniqueIds = Array.from(new Set(relatedProductIds));
  const products = await productRepository.findByIds(uniqueIds);
  const existingIds = new Set(products.map((product) => product.id));
  const hasMissingProduct = uniqueIds.some((id) => !existingIds.has(id));

  if (hasMissingProduct) throw new AppError("Related product not found", 404);
};

export const postService = {
  getBySlug: async (slug: string) => {
    const post = await postRepository.findBySlug(slug);
    if (!post) throw new AppError("Post not found", 404);
    return post;
  },

  list: async (
    filters?: {
      title?: string;
      status?: PostStatus;
      postCategoryId?: number;
      authorId?: string;
    },
    pagination?: { take?: number; skip?: number },
  ) => {
    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      postRepository.findMany(filters, { take, skip }),
      postRepository.count(filters),
    ]);

    return serialize({ items, pagination: buildPagination(total, take, skip) });
  },

  create: async (authorId: string, data: CreatePostDTO) => {
    const existing = await postRepository.findBySlug(data.slug);
    if (existing) throw new AppError("Post slug already exists", 409);

    await ensurePostCategoryExists(data.postCategoryId);
    await ensureRelatedProductsExist(data.relatedProductIds);

    return postRepository.create({ ...data, authorId });
  },

  update: async (slug: string, data: UpdatePostDTO) => {
    const post = await postRepository.findBySlug(slug);
    if (!post) throw new AppError("Post not found", 404);

    if (data.slug && data.slug !== post.slug) {
      const existing = await postRepository.findBySlug(data.slug);
      if (existing) throw new AppError("Post slug already exists", 409);
    }

    await ensurePostCategoryExists(data.postCategoryId);
    await ensureRelatedProductsExist(data.relatedProductIds);

    return postRepository.update(slug, data);
  },

  delete: async (slug: string) => {
    const post = await postRepository.findBySlug(slug);
    if (!post) throw new AppError("Post not found", 404);
    return postRepository.delete(slug);
  },
};
