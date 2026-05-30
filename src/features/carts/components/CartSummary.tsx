"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format-currency";
import { CartItem } from "@/stores";
import Link from "next/link";

interface CartSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
}

export function CartSummary({ items, isLoading = false }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0,
  );

  const shippingFee = subtotal > 0 ? (subtotal >= 1000000 ? 0 : 50000) : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="sticky top-4 bg-white border border-gray-200 rounded-lg p-6 h-fit">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt</h2>

      <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium">
            {shippingFee === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>

        {subtotal > 0 && subtotal < 1000000 && (
          <p className="text-xs text-gray-500">
            Mua thêm {formatCurrency(1000000 - subtotal)} để được miễn phí vận
            chuyển
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
        <span className="text-2xl font-bold text-blue-600">
          {formatCurrency(total)}
        </span>
      </div>

      <Link href="/thanh-toan" className="block w-full">
        <Button
          size="lg"
          className="w-full"
          disabled={items.length === 0 || isLoading}
        >
          Tiến hành thanh toán
        </Button>
      </Link>

      <Link href="/san-pham" className="block w-full mt-3">
        <Button variant="outline" size="lg" className="w-full">
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
}
