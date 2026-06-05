"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { BannerForm } from "@/features/banners/components/banner-form";
import { bannerApi } from "@/features/banners/api/banner.api";
import type { Banner } from "@/types";
import type { BannerListQuery } from "@/types/query/banner-query.type";
import { CreateBannerDTO, UpdateBannerDTO } from "@/validations/banners.schema";

export const BannersAdmin = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>(
    undefined,
  );

  const query: BannerListQuery = useMemo(
    () => ({
      page,
      limit: 10,
      title: search || undefined,
      isActive: onlyActive ? true : undefined,
    }),
    [page, search, onlyActive],
  );

  const bannersQuery = useQuery({
    queryKey: ["banners", query],
    queryFn: () => bannerApi.getAll(query),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof bannerApi.create>[0]) =>
      bannerApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setOpenModal(false);
      setSelectedBanner(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof bannerApi.update>[1];
    }) => bannerApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setOpenModal(false);
      setSelectedBanner(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => bannerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
  });

  const handleOpenCreate = () => {
    setSelectedBanner(undefined);
    setOpenModal(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBanner(undefined);
  };

  const handleSubmit = async (values: CreateBannerDTO | UpdateBannerDTO) => {
    if (!values) return;
    if (selectedBanner) {
      await updateMutation.mutateAsync({
        id: selectedBanner.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values as CreateBannerDTO);
    }
  };

  const handleDelete = async (bannerId: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }
    await deleteMutation.mutateAsync(bannerId);
  };

  const banners = bannersQuery.data?.data?.items ?? [];
  const totalPages = bannersQuery.data?.data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-950">
              Trang quản lý banners
            </h1>
            <p className="text-sm text-zinc-600">
              Thêm mới, cập nhật, xóa, quản lý tất cả banners trên toàn hệ
              thống.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm theo tên..."
              className="max-w-md"
            />
            <label className="inline-flex items-center gap-2 text-sm text-zinc-800">
              <Checkbox
                checked={onlyActive}
                className="rounded-xl"
                onCheckedChange={(checked) => setOnlyActive(Boolean(checked))}
              />
              Hiển thị các banners trạng thái Active
            </label>
          </div>
        </div>

        <Button onClick={handleOpenCreate}>Thêm banner mới</Button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-3">Banner</th>

                <th className="px-4 py-3">Link redirect</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={5}
                  >
                    {bannersQuery.isFetching
                      ? "Loading banners..."
                      : "No banners found."}
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b border-zinc-200 last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-zinc-100">
                          <Image
                            src={banner.imageUrl}
                            alt={banner?.title || "Banner"}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900">
                            {banner.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            ID: {banner.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 break-all max-w-xs text-sm text-zinc-700">
                      {banner.link || "—"}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={banner.isActive ? "outline" : "secondary"}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {" "}
                      {banner.createdAt
                        ? new Date(banner.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="delete"
                        onClick={() => handleDelete(banner.id)}
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
        open={openModal}
        onOpenChange={handleCloseModal}
        title={selectedBanner ? "Cập nhật banner" : "Thêm banner mới"}
        description={
          selectedBanner
            ? "Cập nhật banner."
            : "Thêm mới banner vào kho lưu trữ."
        }
        maxWidth="4xl"
        loading={createMutation.isPending || updateMutation.isPending}
        preventClose={createMutation.isPending || updateMutation.isPending}
      >
        <BannerForm
          initialData={selectedBanner ?? undefined}
          title={selectedBanner ? "Edit banner" : "Create banner"}
          submitLabel={selectedBanner ? "Lưu banner" : "Tạo banner"}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};
