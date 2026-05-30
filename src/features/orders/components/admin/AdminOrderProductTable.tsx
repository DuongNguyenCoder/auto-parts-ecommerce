"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/format-currency";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

export function AdminOrderProductTable({ order }: Props) {
  if (!order.products || order.products.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
        No products in this order.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-700">
          <thead className="bg-zinc-50 text-zinc-900">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">SKU / Category</th>
              <th className="px-6 py-4 text-right font-semibold">Price</th>
              <th className="px-6 py-4 text-center font-semibold">Quantity</th>
              <th className="px-6 py-4 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {order.products.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4 align-top">
                  <div className="flex gap-3">
                    {item.product.imageUrl && (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 line-clamp-2">
                        {item.product.name}
                      </p>
                      <a
                        href={`/san-pham/${item.product.slug}`}
                        className="text-xs text-primary hover:underline"
                      >
                        View product →
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-top text-zinc-600">
                  <div className="text-xs">
                    <p>{item.product.category?.name || "Uncategorized"}</p>
                  </div>
                </td>
                <td className="px-6 py-4 align-top text-right font-semibold text-zinc-900">
                  {formatCurrency(Number(item.product.price))}
                </td>
                <td className="px-6 py-4 align-top text-center">
                  <span className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-900">
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 align-top text-right font-semibold text-zinc-900">
                  {formatCurrency(Number(item.product.price) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
