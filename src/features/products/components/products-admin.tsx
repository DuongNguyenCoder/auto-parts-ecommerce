"use client";

import Image from "next/image";
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
import { ProductForm } from "@/features/products/components/product-form";
import { productApi } from "@/features/products/api/product.api";
import { categoryApi } from "@/features/categories/api/category.api";
import { carModelApi } from "@/features/car-models/api/car-model.api";
import type { Product, ProductListQuery } from "@/types";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "@/validations/products.schema";

const DEFAULT_PAGE_SIZE = 10;

export function ProductsAdmin() {
  const [page, setPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState<number | undefined>(
    undefined,
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const queryClient = useQueryClient();

  const productQueryKey = useMemo(
    () => ["products", { page, searchName, filterCategory }] as const,
    [page, searchName, filterCategory],
  );

  const productsQuery = useQuery({
    queryKey: productQueryKey,
    queryFn: async () => {
      const query: ProductListQuery = {
        take: DEFAULT_PAGE_SIZE,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        name: searchName || undefined,
        categoryId: filterCategory,
      };
      return productApi.getAll(query);
    },
    gcTime: 1000 * 60 * 5, // 5 minutes
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", "admin"],
    queryFn: () => categoryApi.getAll({ take: 200 }),
  });

  const fitmentsQuery = useQuery({
    queryKey: ["carModels", "admin"],
    queryFn: () => carModelApi.getAll({ take: 200 }),
  });

  console.log("Products Fitments ===> ", productsQuery.data);

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductDTO) => productApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStatusMessage({
        type: "success",
        text: "Product created successfully.",
      });
      setIsModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to create product.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductDTO }) =>
      productApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStatusMessage({
        type: "success",
        text: "Product updated successfully.",
      });
      setIsModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to update product.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStatusMessage({
        type: "success",
        text: "Product deleted successfully.",
      });
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to delete product.",
      });
    },
  });

  const products = productsQuery.data?.data ?? [];
  const pagination = productsQuery.data?.pagination;

  const categories = categoriesQuery.data?.data?.items ?? [];
  const fitments = fitmentsQuery.data?.data?.items ?? [];

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (
    values: CreateProductDTO | UpdateProductDTO,
  ) => {
    if (!values) return;

    if (selectedProduct) {
      await updateMutation.mutateAsync({
        id: selectedProduct.id,
        payload: values,
      });
      return;
    }

    await createMutation.mutateAsync(values as CreateProductDTO);
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete product ${product.name}? This cannot be undone.`,
    );

    if (!confirmed) return;
    await deleteMutation.mutateAsync(product.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Products administration
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Manage all products, upload images, assign categories and
              fitments.
            </p>
          </div>

          <Button onClick={openCreateModal}>Create product</Button>
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
            placeholder="Search product name..."
            value={searchName}
            onChange={(event) => {
              setSearchName(event.target.value);
              setPage(1);
            }}
          />

          <Select
            value={filterCategory ? String(filterCategory) : ""}
            onValueChange={(value) => {
              setFilterCategory(value ? Number(value) : undefined);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All categories</SelectItem>
              {categories?.map((category: (typeof categories)[0]) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
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
                <th className="px-4 py-4 font-semibold">Product</th>
                <th className="px-4 py-4 font-semibold">Category</th>
                <th className="px-4 py-4 font-semibold">Price</th>
                <th className="px-4 py-4 font-semibold">Fitments</th>
                <th className="px-4 py-4 font-semibold">Updated</th>
                <th className="px-4 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.length > 0 ? (
                products.map((product: (typeof products)[0]) => (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-zinc-950">
                            {product.name}
                          </div>
                          <div className="truncate text-xs text-zinc-500">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">
                      {product.category?.name}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-700">
                      {product.fitments.length}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-500">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          className="bg-red-400/90 hover:bg-red-500/90"
                          size="sm"
                          onClick={() => handleDelete(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-zinc-500"
                  >
                    {productsQuery.isLoading
                      ? "Loading products..."
                      : "No products found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination ? (
          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-600">
                Showing {products.length} of {pagination.total} products.
              </p>
              <PaginationCustom
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        ) : null}
      </section>

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        maxWidth="4xl"
        description={
          selectedProduct
            ? "Chỉnh sửa thông tin và cập nhật ảnh cho sản phẩm."
            : "Nhập các thông tin và tải ảnh lên để tạo sản phẩm mới."
        }
      >
        <ProductForm
          initialData={selectedProduct ?? undefined}
          categories={categories}
          fitments={fitments}
          title="Thông tin sản phẩm"
          subtitle=""
          submitLabel={selectedProduct ? "Lưu thông tin" : "Thêm sản phẩm"}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}
