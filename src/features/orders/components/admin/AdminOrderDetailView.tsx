"use client";

import { formatDate } from "@/lib/format-date";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

export function AdminOrderDetailView({ order }: Props) {
  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Mã đơn hàng
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {order.orderNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Trạng thái đơn
          </p>
          <div className="mt-2">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Trạng thái thanh toán
          </p>
          <div className="mt-2">
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Thông tin đơn hàng
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Ngày tạo
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Cập nhật lần cuối
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {formatDate(order.updatedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Phương thức thanh toán
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {order.paymentMethod === "CASH_ON_DELIVERY"
                ? "Thanh toán khi nhận hàng"
                : order.paymentMethod === "BANK_TRANSFER"
                  ? "Chuyển khoản"
                  : order.paymentMethod === "CREDIT_CARD"
                    ? "Thẻ tín dụng / thẻ ghi nợ"
                    : "Ví điện tử"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Phương thức giao hàng
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {order.shippingMethod === "DELIVERY"
                ? "Giao hàng"
                : "Nhận tại cửa hàng"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Tổng tạm tính
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {((order.total - order.shippingFee) / 1000).toFixed(0)}k VND
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Phí vận chuyển
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {(order.shippingFee / 1000).toFixed(0)}k VND
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Thông tin khách hàng
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Họ và tên
            </p>
            <p className="mt-2 text-sm text-zinc-900">{order.name || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Số điện thoại
            </p>
            <p className="mt-2 text-sm text-zinc-900">{order.phone || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Email
            </p>
            <p className="mt-2 text-sm text-zinc-900">{order.email || "-"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Địa chỉ giao hàng
            </p>
            <p className="mt-2 text-sm text-zinc-900">{order.address || "-"}</p>
          </div>
        </div>
      </div>

      {order.note && (
        <div className="border-t border-zinc-200 pt-6">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">
            Order Note
          </h3>
          <p className="text-sm text-zinc-700 whitespace-pre-wrap">
            {order.note}
          </p>
        </div>
      )}

      <div className="border-t border-zinc-200 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-600">
            Total Amount
          </p>
          <p className="text-2xl font-bold text-zinc-900">
            {(order.total / 1000).toFixed(0)}k VND
          </p>
        </div>
      </div>
    </div>
  );
}
