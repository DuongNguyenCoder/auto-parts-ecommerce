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
            Order Number
          </p>
          <p className="mt-2 text-lg font-semibold text-zinc-900">
            {order.orderNumber}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Order Status
          </p>
          <div className="mt-2">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Payment Status
          </p>
          <div className="mt-2">
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">
          Order Details
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Created At
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Last Updated
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {formatDate(order.updatedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Payment Method
            </p>
            <p className="mt-2 text-sm text-zinc-900">{order.paymentMethod}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Shipping Method
            </p>
            <p className="mt-2 text-sm text-zinc-900">
              {order.shippingMethod === "DELIVERY"
                ? "Giao hàng"
                : "Nhận tại cửa hàng"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Subtotal
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {((order.total - order.shippingFee) / 1000).toFixed(0)}k VND
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Shipping Fee
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              {(order.shippingFee / 1000).toFixed(0)}k VND
            </p>
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
