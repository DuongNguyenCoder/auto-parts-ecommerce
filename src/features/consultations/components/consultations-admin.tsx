"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listConsultations,
  updateConsultation,
  deleteConsultation,
} from "@/features/consultations/actions";
import type { Consultation } from "@/validations/consulations.schema";
import type { updateConsultationDTO } from "@/validations/consulations.schema";
import type { ConsulationStatus } from "@/../prisma/generated/prisma";

const isValidStatus = (value: string): value is ConsulationStatus => {
  return value === "PENDING" || value === "PROCESSED";
};

type ConsultationWithLoading = Consultation & {
  isLoading?: boolean;
};

export const ConsultationsAdmin = () => {
  const [consultations, setConsultations] = useState<ConsultationWithLoading[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [formData, setFormData] = useState<updateConsultationDTO>({});

  const ITEMS_PER_PAGE = 10;

  const loadConsultations = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await listConsultations(
        {
          status: isValidStatus(statusFilter) ? statusFilter : undefined,
          search: search || undefined,
        },
        {
          take: ITEMS_PER_PAGE,
          skip: (page - 1) * ITEMS_PER_PAGE,
        },
      );

      setConsultations(result.items || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error loading consultations:", error);
      setConsultations([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const load = async () => {
      await loadConsultations();
    };
    load();
  }, [loadConsultations]);

  const handleEdit = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setFormData({
      status: consultation.status,
      name: consultation.name,
      phone: consultation.phone,
      email: consultation.email || "",
      note: consultation.note || "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedConsultation(null);
    setFormData({});
  };

  const handleUpdate = async () => {
    if (!selectedConsultation) return;

    try {
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === selectedConsultation.id ? { ...c, isLoading: true } : c,
        ),
      );

      const updateData: updateConsultationDTO = {
        status: formData.status,
      };

      await updateConsultation(selectedConsultation.id, updateData);
      await loadConsultations();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating consultation:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tư vấn này?")) {
      return;
    }

    try {
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isLoading: true } : c)),
      );

      await deleteConsultation(id);
      await loadConsultations();
    } catch (error) {
      console.error("Error deleting consultation:", error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "PROCESSED" ? "outline" : "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-zinc-950">
              Quản lý tư vấn
            </h1>
            <p className="text-sm text-zinc-600">
              Xem, cập nhật và xóa các yêu cầu tư vấn từ khách hàng.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Tìm kiếm theo tên, số điện thoại hoặc email"
              className="max-w-md"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chưa xử lý</SelectItem>
                <SelectItem value="PROCESSED">Đã xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm text-zinc-700">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Số điện thoại</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={6}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                    colSpan={6}
                  >
                    Không tìm thấy tư vấn nào.
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => (
                  <tr
                    key={consultation.id}
                    className="border-b border-zinc-200 last:border-b-0 opacity-60"
                    style={{
                      opacity: consultation.isLoading ? 0.6 : 1,
                    }}
                  >
                    <td className="px-4 py-4 font-medium text-zinc-900">
                      {consultation.name}
                    </td>
                    <td className="px-4 py-4">{consultation.phone}</td>
                    <td className="px-4 py-4">{consultation.email || "—"}</td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusColor(consultation.status)}>
                        {consultation.status === "PENDING"
                          ? "Chưa xử lý"
                          : "Đã xử lý"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {new Date(consultation.createdAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(consultation)}
                        disabled={consultation.isLoading}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(consultation.id)}
                        disabled={consultation.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-zinc-600">
            Trang {page} / {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onOpenChange={handleCloseModal}
        title="Cập nhật trạng thái tư vấn"
        description={
          selectedConsultation
            ? `Tư vấn từ ${selectedConsultation.name}`
            : "Cập nhật thông tin tư vấn"
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Tên
            </label>
            <Input
              value={formData.name || ""}
              disabled
              className="bg-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Số điện thoại
            </label>
            <Input
              value={formData.phone || ""}
              disabled
              className="bg-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Email
            </label>
            <Input
              value={formData.email || ""}
              disabled
              className="bg-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Ghi chú
            </label>
            <textarea
              value={formData.note || ""}
              disabled
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Trạng thái
            </label>
            <Select
              value={formData.status || ""}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  status: isValidStatus(value) ? value : undefined,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Chưa xử lý</SelectItem>
                <SelectItem value="PROCESSED">Đã xử lý</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleUpdate}
              className="flex-1"
              disabled={!selectedConsultation}
            >
              Lưu thay đổi
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="outline"
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
