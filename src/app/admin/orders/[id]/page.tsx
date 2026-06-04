"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useOrderDetail } from "@/features/orders/hooks/useOrderDetail";
import { AdminOrderDetailView } from "@/features/orders/components/admin/AdminOrderDetailView";
import { AdminOrderProductTable } from "@/features/orders/components/admin/AdminOrderProductTable";
import { AdminOrderUpdateForm } from "@/features/orders/components/admin/AdminOrderUpdateForm";
import type { UpdateOrderDTO } from "@/validations/order.schema";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { order, isLoading, error, updateOrderAsync, isUpdating } =
    useOrderDetail(orderId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<UpdateOrderDTO>({});
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const openEditModal = () => {
    if (order) {
      setFormValues({
        status: order.status,
        paymentStatus: order.paymentStatus,
        note: order.note || null,
      });
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (values: UpdateOrderDTO) => {
    if (!values) return;
    try {
      await updateOrderAsync(values);
      setStatusMessage({
        type: "success",
        text: "Cập nhật đơn hàng thành công.",
      });
      setIsModalOpen(false);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Cập nhật đơn hàng thất bại. Vui lòng thử lại.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="text-center text-zinc-600">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <p className="font-semibold">Lỗi khi tải đơn hàng</p>
          <p className="mt-1 text-sm">
            {error instanceof Error ? error.message : "Không tìm thấy đơn hàng"}
          </p>
          <Link href="/admin/orders" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Quay lại danh sách đơn hàng
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              ← Quay lại danh sách đơn hàng
            </Button>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-950">
            Chi tiết đơn hàng
          </h1>
          <p className="mt-1 text-zinc-600">Mã đơn: {order.orderNumber}</p>
        </div>
        <Button onClick={openEditModal} size="lg" className="rounded-md">
          Cập nhật đơn hàng
        </Button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`rounded-3xl border px-4 py-3 font-semibold ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Order Detail View */}
      <AdminOrderDetailView order={order} />

      {/* Products Table */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">Products</h2>
        <AdminOrderProductTable order={order} />
      </div>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Chỉnh sửa đơn hàng"
        description={`Cập nhật đơn ${order.orderNumber}`}
        maxWidth="lg"
        loading={isUpdating}
        preventClose={isUpdating}
      >
        <AdminOrderUpdateForm
          order={order}
          values={formValues}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
