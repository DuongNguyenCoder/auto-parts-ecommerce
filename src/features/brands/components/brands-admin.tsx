"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { BrandForm } from "@/features/brands/components/brand-form";
import { brandApi } from "@/features/brands/api";
import type {
  ApiResponse,
  Brand,
  BrandListQuery,
  PaginatedData,
} from "@/types";
import type {
  CreateBrandDTO,
  UpdateBrandDTO,
} from "@/validations/brands.schema";
import Image from "next/image";

const DEFAULT_PAGE_SIZE = 10;

export function BrandsAdmin() {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const brandQueryKey = useMemo(
    () => ["brands", { page, searchName }] as const,
    [page, searchName],
  );

  const brandsQuery = useQuery<ApiResponse<PaginatedData<Brand>>>({
    queryKey: brandQueryKey,
    queryFn: async () => {
      const query: BrandListQuery = {
        take: DEFAULT_PAGE_SIZE,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        name: searchName || undefined,
      };
      return brandApi.getAll(query);
    },
    gcTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateBrandDTO) => brandApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setStatusMessage({
        type: "success",
        text: "Brand created successfully.",
      });
      setIsModalOpen(false);
      setSelectedBrand(null);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to create brand.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBrandDTO }) =>
      brandApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setStatusMessage({
        type: "success",
        text: "Brand updated successfully.",
      });
      setIsModalOpen(false);
      setSelectedBrand(null);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to update brand.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => brandApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setStatusMessage({
        type: "success",
        text: "Brand deleted successfully.",
      });
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to delete brand.",
      });
    },
  });

  const brands = brandsQuery.data?.data?.items ?? [];
  const pagination = brandsQuery.data?.data?.pagination;

  const openCreateModal = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBrand(null);
    setIsModalOpen(false);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleFormSubmit = async (values: CreateBrandDTO | UpdateBrandDTO) => {
    if (selectedBrand) {
      await updateMutation.mutateAsync({
        id: selectedBrand.id,
        payload: values as UpdateBrandDTO,
      });
      return;
    }

    await createMutation.mutateAsync(values as CreateBrandDTO);
  };

  const handleDelete = async (brand: Brand) => {
    const confirmed = window.confirm(
      `Delete brand ${brand.name}? This cannot be undone.`,
    );

    if (!confirmed) return;
    await deleteMutation.mutateAsync(brand.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Trang quản lý các hãng xe
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Quản lý tất cả các hãng xe trên toàn hệ thống
            </p>
          </div>

          <Button onClick={openCreateModal}>Thêm hãng xe mới</Button>
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
            placeholder="Tìm theo tên hãng..."
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
                <th className="px-4 py-4 font-semibold">Logo</th>
                <th className="px-4 py-4 font-semibold">Tên hãng</th>
                <th className="px-4 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 align-top text-zinc-500">
                      {brand.id}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {brand.imageUrl ? (
                        <Image
                          src={brand.imageUrl}
                          alt={brand.name}
                          width={50}
                          height={50}
                          className="rounded object-cover border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-zinc-100" />
                      )}
                    </td>
                    <td className="px-4 py-4 align-top font-medium text-zinc-900">
                      {brand.name}
                    </td>
                    <td className="px-4 py-4 align-top space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(brand)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="delete"
                        size="sm"
                        onClick={() => handleDelete(brand)}
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
                    {brandsQuery.isLoading
                      ? "Loading brands..."
                      : "No brands found. Create one to get started."}
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
        title={selectedBrand ? "Edit brand" : "Create brand"}
        description={
          selectedBrand
            ? "Update the existing brand name."
            : "Create a new brand for car models and metadata."
        }
        maxWidth="lg"
        loading={isSaving}
        preventClose={isSaving}
      >
        <BrandForm
          initialData={selectedBrand ?? undefined}
          onSubmit={handleFormSubmit}
          submitLabel={selectedBrand ? "Update brand" : "Create brand"}
          title={selectedBrand ? "Edit brand" : "New brand"}
        />
      </Modal>
    </div>
  );
}
