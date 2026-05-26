"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { PostCategoryForm } from "@/features/post-categories/components/post-category-form";
import { postCategoryApi } from "@/features/post-categories/api/post-category.api";
import type { PostCategory } from "@/types";
import type { PostCategoryListQuery } from "@/types/query/post-category-query.type";
import {
  CreatePostCategoryDTO,
  UpdatePostCategoryDTO,
} from "@/validations/post-categories.schema";

export const PostCategoriesAdmin = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    PostCategory | undefined
  >(undefined);

  const query: PostCategoryListQuery = useMemo(
    () => ({
      page,
      limit: 10,
      name: search || undefined,
    }),
    [page, search],
  );

  const categoriesQuery = useQuery({
    queryKey: ["post-categories", query],
    queryFn: () => postCategoryApi.getAll(query),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof postCategoryApi.create>[0]) =>
      postCategoryApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      setIsModalOpen(false);
      setSelectedCategory(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof postCategoryApi.update>[1];
    }) => postCategoryApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      setIsModalOpen(false);
      setSelectedCategory(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => postCategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-categories"] });
    },
  });

  const openCreateModal = () => {
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (category: PostCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handleFormSubmit = async (
    values: CreatePostCategoryDTO | UpdatePostCategoryDTO,
  ) => {
    if (selectedCategory) {
      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values as CreatePostCategoryDTO);
    }
  };

  const handleDelete = async (category: PostCategory) => {
    if (
      !window.confirm("Are you sure you want to delete this post category?")
    ) {
      return;
    }
    await deleteMutation.mutateAsync(category.id);
  };

  const categories = categoriesQuery.data?.data?.items ?? [];
  const totalPages = categoriesQuery.data?.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-950">
              Post category management
            </h1>
            <p className="text-sm text-zinc-600">
              Add, edit, or remove categories that organize blog posts.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name"
              className="max-w-md"
            />
          </div>
        </div>

        <Button onClick={openCreateModal}>Create category</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={3}
                  >
                    {categoriesQuery.isFetching
                      ? "Loading categories..."
                      : "No post categories found."}
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-zinc-200 last:border-b-0"
                  >
                    <td className="px-4 py-4 font-semibold text-zinc-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 text-zinc-700">{category.slug}</td>
                    <td className="px-4 py-4 space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4">
          <PaginationCustom
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={selectedCategory ? "Edit post category" : "Create post category"}
        description={
          selectedCategory
            ? "Update the selected post category details."
            : "Create a new category to organize blog posts."
        }
        maxWidth="lg"
        loading={createMutation.isPending || updateMutation.isPending}
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <PostCategoryForm
          initialData={selectedCategory ?? undefined}
          title={
            selectedCategory ? "Edit post category" : "Create post category"
          }
          submitLabel={selectedCategory ? "Save changes" : "Create category"}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};
