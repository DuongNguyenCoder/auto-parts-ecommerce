"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AdminOrderUpdateForm } from "./AdminOrderUpdateForm";
import type { Order } from "@/types";
import type { UpdateOrderDTO } from "@/validations/order.schema";

interface Props {
  open: boolean;
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateOrderDTO) => Promise<void>;
  isLoading?: boolean;
}

export function AdminOrderUpdateModal({
  open,
  order,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: Props) {
  const [values, setValues] = useState<UpdateOrderDTO>(() => ({
    status: order?.status,
    paymentStatus: order?.paymentStatus,
    note: order?.note || null,
  }));

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      title="Cập nhật đơn hàng"
      description={
        order
          ? `Cập nhật thông tin cho đơn hàng ${order.orderNumber}`
          : undefined
      }
      onOpenChange={onOpenChange}
      maxWidth="2xl"
      loading={isLoading}
      preventClose={isLoading}
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </>
      }
    >
      {/* {order && (
        <AdminOrderUpdateForm
          order={order}
          values={values}
          onSubmit={handleChange}
        />
      )} */}
      <div>demo</div>
    </Modal>
  );
}
