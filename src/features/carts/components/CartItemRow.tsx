"use client";

import { formatCurrency } from "@/lib/format-currency";
import { QuantityControl } from "./QuantityControl";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartItem } from "@/stores";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isLoading?: boolean;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
}: CartItemRowProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    onRemove(item.id);
  };

  const displayPrice = item.salePrice || item.price;
  const totalPrice = displayPrice * item.quantity;
  const hasDiscount = item.salePrice && item.salePrice < item.price;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Product Image */}
      <Link href={`/product/${item.slug}`}>
        <div className="relative h-24 w-24 shrink-0 rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
            {item.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600">{item.brand.name}</p>

        <div className="flex items-center gap-2 mt-1">
          {hasDiscount && (
            <>
              <span className="text-sm line-through text-gray-500">
                {formatCurrency(item.price)}
              </span>
              <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                -
                {Math.round(
                  ((item.price - item.salePrice!) / item.price) * 100,
                )}
                %
              </span>
            </>
          )}
          <span className="font-semibold text-gray-900">
            {formatCurrency(displayPrice)}
          </span>
        </div>
      </div>

      {/* Quantity Control */}
      <div className="flex flex-col items-end justify-between">
        <QuantityControl
          quantity={item.quantity}
          stock={item.stock}
          onQuantityChange={(quantity) => onUpdateQuantity(item.id, quantity)}
          isLoading={isLoading || isRemoving}
        />

        {/* Total Price */}
        <div className="text-right">
          <p className="text-sm text-gray-600">Thành tiền</p>
          <p className="font-bold text-lg text-gray-900">
            {formatCurrency(totalPrice)}
          </p>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isLoading || isRemoving}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-fit"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
