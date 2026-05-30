"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import type { CartItem } from "@/stores";

interface Props {
  items: CartItem[];
  onIncrement: (itemId: number) => void;
  onDecrement: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

export function CheckoutItemList({
  items,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">
        Giỏ hàng của bạn hiện đang trống. Vui lòng quay lại trang sản phẩm để
        thêm hàng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const itemPrice = (item.salePrice || item.price) * item.quantity;

        return (
          <div
            key={item.id}
            className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.15em] text-gray-500">
                    {item.brand.name}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {formatCurrency(item.salePrice || item.price)} / cái
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDecrement(item.id)}
                  >
                    –
                  </Button>
                  <span className="min-w-10 text-center text-sm font-semibold text-gray-900">
                    {item.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onIncrement(item.id)}
                  >
                    +
                  </Button>
                </div>

                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(itemPrice)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onRemove(item.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
