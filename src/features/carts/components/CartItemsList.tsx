"use client";

import { CartItem } from "@/stores";
import { CartItemRow } from "./CartItemRow";

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isLoading?: boolean;
}

export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
}: CartItemsListProps) {
  return (
    <div className="space-y-0">
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
