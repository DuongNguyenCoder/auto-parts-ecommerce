"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { CarModelForm } from "@/features/car-models/components/car-model-form";
import { carModelApi } from "@/features/car-models/api/car-model.api";
import { brandApi } from "@/features/brands/api/brand.api";
import type {
  ApiResponse,
  Brand,
  CarModel,
  CarModelListQuery,
  PaginatedData,
} from "@/types";
import type {
  CreateCarModelDTO,
  UpdateCarModelDTO,
} from "@/validations/car-models.schema";
import Image from "next/image";

const DEFAULT_PAGE_SIZE = 10;

export function CarModelsAdmin() {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [filterBrand, setFilterBrand] = useState<number | undefined>(undefined);
  const [selectedCarModel, setSelectedCarModel] = useState<
    CarModel | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const carModelQueryKey = useMemo(
    () => ["car-models", { page, searchName, filterBrand }] as const,
    [page, searchName, filterBrand],
  );

  const carModelsQuery = useQuery<ApiResponse<PaginatedData<CarModel>>>({
    queryKey: carModelQueryKey,
    queryFn: async () => {
      const query: CarModelListQuery = {
        take: DEFAULT_PAGE_SIZE,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        name: searchName || undefined,
        brandId: filterBrand,
      };
      return carModelApi.getAll(query);
    },
    gcTime: 1000 * 60 * 5,
  });

  const brandsQuery = useQuery<ApiResponse<PaginatedData<Brand>>>({
    queryKey: ["brands", "admin"],
    queryFn: () => brandApi.getAll({ take: 200 }),
    staleTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCarModelDTO) => carModelApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-models"] });
      setStatusMessage({
        type: "success",
        text: "Car model created successfully.",
      });
      setSelectedCarModel(undefined);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to create car model.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCarModelDTO }) =>
      carModelApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-models"] });
      setStatusMessage({
        type: "success",
        text: "Car model updated successfully.",
      });
      setSelectedCarModel(undefined);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update car model.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => carModelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-models"] });
      setStatusMessage({
        type: "success",
        text: "Car model deleted successfully.",
      });
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to delete car model.",
      });
    },
  });

  const carModels = carModelsQuery.data?.data?.items ?? [];
  const pagination = carModelsQuery.data?.data?.pagination;
  const brands = brandsQuery.data?.data?.items ?? [];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreateModal = () => {
    setSelectedCarModel(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (carModel: CarModel) => {
    setSelectedCarModel(carModel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCarModel(undefined);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (
    values: CreateCarModelDTO | UpdateCarModelDTO,
  ) => {
    if (selectedCarModel) {
      await updateMutation.mutateAsync({
        id: selectedCarModel.id,
        payload: values as UpdateCarModelDTO,
      });
      return;
    }

    await createMutation.mutateAsync(values as CreateCarModelDTO);
  };

  const handleDelete = async (carModel: CarModel) => {
    const confirmed = window.confirm(
      `Delete car model ${carModel.name}? This cannot be undone.`,
    );
    if (!confirmed) return;

    await deleteMutation.mutateAsync(carModel.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Trang quản lý các dòng xe
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Quản lý danh sách các dòng xe theo hãng, năm sản xuất,... trên
              toàn hệ thống
            </p>
          </div>

          <Button onClick={openCreateModal}>Thêm dòng xe</Button>
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

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            placeholder="Tìm theo tên dòng xe..."
            value={searchName}
            onChange={(event) => {
              setSearchName(event.target.value);
              setPage(1);
            }}
          />

          <Select
            value={filterBrand ? String(filterBrand) : ""}
            onValueChange={(value) => {
              setFilterBrand(value ? Number(value) : undefined);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả các hãng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Tất cả các hãng</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-4 font-semibold">ID</th>
                <th className="px-4 py-4 font-semibold">Logo</th>
                <th className="px-4 py-4 font-semibold">Hãng</th>
                <th className="px-4 py-4 font-semibold">Tên dòng xe</th>
                <th className="px-4 py-4 font-semibold">Năm sản xuất</th>
                <th className="px-4 py-4 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {carModels.length > 0 ? (
                carModels.map((carModel) => (
                  <tr key={carModel.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 align-top text-zinc-500">
                      {carModel.id}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {carModel.imageUrl ? (
                        <Image
                          src={carModel.imageUrl}
                          alt={carModel.name}
                          width={50}
                          height={50}
                          className="rounded object-cover border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-zinc-100" />
                      )}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-900">
                      {carModel.brand?.name ?? "-"}
                    </td>
                    <td className="px-4 py-4 align-top font-medium text-zinc-900">
                      {carModel.name}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">
                      {carModel.year ?? "-"}
                    </td>
                    <td className="px-4 py-4 align-top space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(carModel)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="delete"
                        size="sm"
                        onClick={() => handleDelete(carModel)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                  >
                    {carModelsQuery.isLoading
                      ? "Loading car models..."
                      : "No car models found. Create one to get started."}
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
        title={selectedCarModel ? "Edit car model" : "Create car model"}
        description={
          selectedCarModel
            ? "Update the selected car model details."
            : "Create a new car model for vehicle fitments."
        }
        maxWidth="lg"
        loading={isSaving}
        preventClose={isSaving}
      >
        <CarModelForm
          initialData={selectedCarModel}
          brands={brands}
          onSubmit={handleFormSubmit}
          submitLabel={
            selectedCarModel ? "Update car model" : "Create car model"
          }
          title={selectedCarModel ? "Edit car model" : "New car model"}
        />
      </Modal>
    </div>
  );
}
