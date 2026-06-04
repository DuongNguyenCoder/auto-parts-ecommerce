import {
  PostFormFields,
  PostFormOutput,
} from "@/features/posts/components/post-form.types";
import { formatDate } from "@/lib/format-date";
import { Post } from "@/types";
import { CreatePostDTO, UpdatePostDTO } from "@/validations/posts.schema";

export const EMPTY_POST_FORM_VALUES: PostFormFields = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  thumbnail: "",
  status: "DRAFT",
  publishedAt: undefined,
  metaTitle: "",
  metaDesc: "",
  postCategoryId: undefined,
  relatedProductIds: [],
};

export const mapPostToFormValues = (post?: Post): PostFormFields => {
  if (!post) return EMPTY_POST_FORM_VALUES;

  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    content: post.content ?? "",
    excerpt: post.excerpt ?? "",
    thumbnail: post.thumbnail ?? "",
    status: post.status ?? "DRAFT",

    publishedAt: post.publishedAt ? formatDate(post.publishedAt) : "",

    metaTitle: post.metaTitle ?? "",
    metaDesc: post.metaDesc ?? "",

    postCategoryId: post.postCategoryId ?? undefined,

    relatedProductIds:
      post.relatedProducts?.map((product: any) => product.id) ?? [],
  };
};

export const mapFormValuesToCreateDTO = (
  values: PostFormOutput,
): CreatePostDTO => {
  return {
    title: values.title,
    slug: values.slug,
    content: values.content,
    excerpt: values.excerpt,
    thumbnail: values.thumbnail,
    status: values.status,
    publishedAt: values.publishedAt || undefined,
    metaTitle: values.metaTitle,
    metaDesc: values.metaDesc,
    postCategoryId: values.postCategoryId,
    relatedProductIds: values.relatedProductIds ?? [],
  };
};

export const mapFormValuesToUpdateDTO = (
  values: PostFormOutput,
): UpdatePostDTO => {
  return {
    title: values.title,
    slug: values.slug,
    content: values.content,
    excerpt: values.excerpt,
    thumbnail: values.thumbnail,
    status: values.status,
    publishedAt: values.publishedAt,
    metaTitle: values.metaTitle,
    metaDesc: values.metaDesc,
    postCategoryId: values.postCategoryId,
    relatedProductIds: values.relatedProductIds,
  };
};
