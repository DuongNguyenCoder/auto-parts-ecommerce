"use client";

import { formatDate } from "@/lib/format-date";
import { formatCurrency } from "@/lib/format-currency";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import type { Order } from "@/types";

interface Props {
  orders: Order[];
  onUpdate: (order: Order) => void;
  isLoading?: boolean;
}

export function AdminOrderTable({
  orders,
  onUpdate,
  isLoading = false,
}: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
        Không có đơn hàng nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Mã đơn hàng
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Ngày đặt
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Thanh toán
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
              Tổng tiền
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {order.orderNumber}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4">
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                {formatCurrency(order.total)}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onUpdate(order)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  Cập nhật
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
