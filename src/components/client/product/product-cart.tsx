"use client";

import Image from "next/image";
import Link from "next/link";

import { Eye, Heart, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format-currency";

import type { Product } from "@/types";
import { useCartStore } from "@/stores";

type Props = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
};

export function ProductCard({ product, onAddToCart, className }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      skuId: undefined,
      slug: product.slug,
      name: product.name,
      image: product.imageUrl ?? "",
      price: product.price,
      quantity: 1,
      stock: 9999,
      brand: {
        id: Number(product.categoryId),
        name: product.category?.name ?? "",
      },
    });
  };

  return (
    <article
      className={cn(
        "min-w-0 group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-sm",
        className,
      )}
    >
      {/* IMAGE */}
      <Link
        href={`/${product.slug}`}
        className="relative block overflow-hidden bg-muted"
      >
        <div className="relative aspect-square overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mb-2">
          <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category?.name ?? "Auto Part"}
          </span>
        </div>

        <Link href={`/${product.slug}`} className="group/title">
          <h3 className="line-clamp-2 min-h-[32px] text-sm font-semibold leading-6 text-foreground transition-colors group-hover/title:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3">
          <p className="text-lg font-bold tracking-tight">
            {formatCurrency(product.price)}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-3 grid">
          {/* <button
            type="button"
            className="flex h-10 col-span-1  items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Heart className="h-4 w-4 text-red-600 shrink-0" />
          </button> */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex min-w-0 h-10 col-span-3 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </article>
  );
}
