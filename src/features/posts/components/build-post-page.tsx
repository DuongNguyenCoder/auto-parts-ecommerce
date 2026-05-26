"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PostForm } from "@/features/posts/components/post-form";
import { postApi } from "@/features/posts/api/post.api";
import { postCategoryApi } from "@/features/post-categories/api/post-category.api";
import { CreatePostDTO, UpdatePostDTO } from "@/validations/posts.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const BuildPostPage = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug") ?? undefined;

  const categoriesQuery = useQuery({
    queryKey: ["post-categories", "admin"],
    queryFn: () => postCategoryApi.getAll({ take: 100 }),
  });

  const postQuery = useQuery({
    queryKey: ["posts", slug],
    queryFn: () => postApi.getBySlug(slug as string),
    enabled: !!slug,
  });

  const selectedPost = postQuery.data?.data;

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof postApi.create>[0]) =>
      postApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Thêm bài viết thành công");
      router.push("/admin/posts");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Parameters<typeof postApi.update>[1];
    }) => postApi.update(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Cập nhật bài viết thành công");
      router.push("/admin/posts");
    },
  });

  const handleSubmit = async (values: CreatePostDTO | UpdatePostDTO) => {
    if (!values) return;
    if (selectedPost) {
      await updateMutation.mutateAsync({
        slug: selectedPost.slug,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values as CreatePostDTO);
    }
  };

  const handleCancel = () => {
    router.push("/admin/posts");
  };

  const categories = categoriesQuery.data?.data?.items ?? [];

  return (
    <PostForm
      initialData={selectedPost ?? undefined}
      postCategories={categories}
      title={selectedPost ? "Edit post" : "Create post"}
      submitLabel={selectedPost ? "Save changes" : "Create post"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};
