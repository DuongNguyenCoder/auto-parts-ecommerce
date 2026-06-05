"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { CategoryForm } from "@/features/categories/components/category-form";
import { categoryApi } from "@/features/categories/api/category.api";
import type {
  ApiResponse,
  Category,
  CategoryListQuery,
  PaginatedData,
} from "@/types";
import type {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/validations/categories.schema";

const DEFAULT_PAGE_SIZE = 10;

export function CategoriesAdmin() {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const categoryQueryKey = useMemo(
    () => ["categories", { page, searchName }] as const,
    [page, searchName],
  );

  const categoriesQuery = useQuery<ApiResponse<PaginatedData<Category>>>({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      const query: CategoryListQuery = {
        take: DEFAULT_PAGE_SIZE,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        name: searchName || undefined,
      };
      return categoryApi.getAll(query);
    },
    gcTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryDTO) => categoryApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setStatusMessage({
        type: "success",
        text: "Category created successfully.",
      });
      setSelectedCategory(null);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to create category.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryDTO }) =>
      categoryApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setStatusMessage({
        type: "success",
        text: "Category updated successfully.",
      });
      setSelectedCategory(null);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to update category.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setStatusMessage({
        type: "success",
        text: "Category deleted successfully.",
      });
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to delete category.",
      });
    },
  });

  const categories = categoriesQuery.data?.data?.items ?? [];
  const pagination = categoriesQuery.data?.data?.pagination;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (
    values: CreateCategoryDTO | UpdateCategoryDTO,
  ) => {
    if (selectedCategory) {
      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        payload: values as UpdateCategoryDTO,
      });
      return;
    }

    await createMutation.mutateAsync(values as CreateCategoryDTO);
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Delete category ${category.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    await deleteMutation.mutateAsync(category.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Trang quản lý các danh mục
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Quản lý tất cả các danh mục phân loại sản phẩm trên toàn hệ thống
            </p>
          </div>

          <Button onClick={openCreateModal}>Thêm danh mục sản phẩm mới</Button>
        </div>

        {statusMessage ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              statusMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {statusMessage.text}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            placeholder="Tìm theo tên loại phụ tùng..."
            value={searchName}
            onChange={(event) => {
              setSearchName(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-4 font-semibold">ID</th>
                <th className="px-4 py-4 font-semibold">Loại phụ tùng</th>
                <th className="px-4 py-4 font-semibold">Slug</th>
                <th className="px-4 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 align-top text-zinc-500">
                      {category.id}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-900">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">
                      {category.slug}
                    </td>
                    <td className="px-4 py-4 align-top space-x-2">
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
                        variant="delete"
                        size="sm"
                        onClick={() => handleDelete(category)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                  >
                    {categoriesQuery.isLoading
                      ? "Loading categories..."
                      : "No categories found. Create one to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination?.totalPages ? (
          <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4">
            <PaginationCustom
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </section>

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={selectedCategory ? "Edit category" : "Create category"}
        description={
          selectedCategory
            ? "Update the selected category details."
            : "Create a new category for your product catalog."
        }
        maxWidth="lg"
        loading={isSaving}
        preventClose={isSaving}
      >
        <CategoryForm
          initialData={selectedCategory ?? undefined}
          onSubmit={handleFormSubmit}
          submitLabel={selectedCategory ? "Update category" : "Create category"}
          title={selectedCategory ? "Edit category" : "New category"}
        />
      </Modal>
    </div>
  );
}
