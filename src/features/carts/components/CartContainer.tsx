"use client";

import { useCartStore } from "@/stores/cart/cart.store";
import { useEffect, useState } from "react";
import { CartHeader } from "./CartHeader";
import { CartItemsList } from "./CartItemsList";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";

export function CartContainer() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const isHydrated = useCartStore((state) => state.isHydrated);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // Hydration fix for SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Đang tải...</div>
      </div>
    );
  }
  console.log("Log Cart Items từ Page Gio  hang ==> ", items);

  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {!hasItems ? (
          <EmptyCart />
        ) : (
          <>
            <CartHeader itemCount={items.length} onClearCart={clearCart} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Cart Items */}
              <div className="lg:col-span-2 bg-white rounded-lg p-6">
                <CartItemsList
                  items={items}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary items={items} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
