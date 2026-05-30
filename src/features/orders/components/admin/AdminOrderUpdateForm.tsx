"use client";

import { SelectCustom } from "@/components/shared/custom/select-custom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";
import {
  updateOrderSchema,
  type UpdateOrderDTO,
} from "@/validations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const orderStatusOptions = [
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "SHIPPED", label: "Đã gửi" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const paymentStatusOptions = [
  { value: "PENDING", label: "Chờ thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
  { value: "FAILED", label: "Thanh toán thất bại" },
  { value: "REFUNDED", label: "Đã hoàn tiền" },
];

interface Props {
  order: Order;
  values: UpdateOrderDTO;
  onSubmit: (values: UpdateOrderDTO) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

type OrderFormFields = z.input<typeof updateOrderSchema>;

export function AdminOrderUpdateForm({
  order,
  values,
  onSubmit,
  onCancel,
  submitLabel = "Lưu",
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<OrderFormFields>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      status: order?.status ?? "PENDING",
      paymentStatus: order?.paymentStatus ?? "PAID",
      paymentMethod: order?.paymentMethod ?? "CASH_ON_DELIVERY",
      shippingMethod: order?.shippingMethod ?? "DELIVERY",
      note: order?.note ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as UpdateOrderDTO))}
      className="space-y-6"
    >
      {/* Order Info (Read-only) */}
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Thông tin đơn hàng
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Mã đơn hàng
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {order.orderNumber}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Tổng tiền
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {(order.total / 1000).toFixed(0)}k VND
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Phương thức giao
            </p>
            <p className="mt-1 text-sm text-gray-900">
              {order.shippingMethod === "DELIVERY"
                ? "Giao hàng"
                : "Nhận tại cửa hàng"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-600">
              Phương thức thanh toán
            </p>
            <p className="mt-1 text-sm text-gray-900">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="order-status">Trạng thái đơn hàng *</Label>
          {/* <select
            id="order-status"
            value={values.status || ""}
            onChange={(e) => onChange("status", e.target.value)}
            className="mt-2 block w-full rounded-3xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">-- Chọn trạng thái --</option>
            {orderStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select> */}

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <SelectCustom
                items={orderStatusOptions}
                value={field.value ? String(field.value) : ""}
                placeholder="-- Chọn trạng thái --"
                getLabel={(item) => item.label}
                getValue={(item) => String(item.value)}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="payment-status">Trạng thái thanh toán *</Label>
          {/* <select
            id="payment-status"
            value={values.paymentStatus || ""}
            onChange={(e) => onChange("paymentStatus", e.target.value)}
            className="mt-2 block w-full rounded-3xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value=""></option>
            {paymentStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select> */}
          <Controller
            control={control}
            name="paymentStatus"
            render={({ field }) => (
              <SelectCustom
                items={paymentStatusOptions}
                value={field.value ? String(field.value) : ""}
                placeholder="-- Chọn trạng thái --"
                getLabel={(item) => item.label}
                getValue={(item) => String(item.value)}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="order-note">Ghi chú</Label>
          <Textarea
            id="order-note"
            {...register("note")}
            placeholder="Thêm ghi chú cho đơn hàng..."
            rows={4}
          />
        </div>
      </div>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40",
          "border-t border-sky-100 bg-white/90 px-6 py-4 backdrop-blur-xl",
          "shadow-[0_-4px_24px_rgba(56,189,248,0.08)]",
        )}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="text-[12px] text-slate-400">
            {isSubmitting
              ? "Saving…"
              : "All changes are saved automatically on submit"}
          </p>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className={cn(
                  "h-11 rounded-2xl border-[1.5px] border-sky-100 bg-transparent px-6",
                  "text-[13.5px] font-semibold text-slate-600 transition-all duration-200",
                  "hover:border-sky-200 hover:bg-sky-50 hover:text-slate-800",
                  "disabled:opacity-50",
                )}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "relative h-11 overflow-hidden rounded-2xl px-8",
                "bg-gradient-to-r from-sky-500 to-blue-600",
                "text-[13.5px] font-semibold text-white",
                "shadow-[0_4px_16px_rgba(37,99,235,0.3)]",
                "transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)]",
                "active:scale-[0.98] active:translate-y-0",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-75"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13 5l-6 6-3-3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {submitLabel}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
