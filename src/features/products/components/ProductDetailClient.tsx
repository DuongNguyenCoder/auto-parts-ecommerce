"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatCurrency } from "@/lib/format-currency";
import { useCartStore } from "@/stores";
import type { Product } from "@/types";
import ProductGallery from "./ProductGallery";
import { ProductCard } from "@/components/client/product/product-cart";

type Props = {
  product: Product;
  related?: Product[];
};

export default function ProductDetailClient({ product, related = [] }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const clearItem = useCartStore((s) => s.clearCart);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      skuId: undefined,
      slug: product.slug,
      name: product.name,
      image: product.imageUrl ?? "",
      price: product.price,
      quantity,
      stock: 9999,
      brand: {
        id: Number(product.categoryId),
        name: product.category?.name ?? "",
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Trang chủ</Link> /{" "}
          <Link href={`/danh-muc/${product.category?.slug}`}>
            {product.category?.name}
          </Link>{" "}
          / <span className="font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ProductGallery product={product} />

        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mã danh mục: {product.category?.name}
          </p>

          <div className="mt-4">
            <p className="text-2xl font-extrabold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2"
              >
                -
              </button>
              <div className="px-4 py-2">{quantity}</div>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Yêu thích
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Thông tin chi tiết</h3>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5">
              <li>Mã sản phẩm: {product.id}</li>
              <li>Danh mục: {product.category?.name}</li>
              <li>
                Phù hợp cho:{" "}
                {product.fitments?.map((f) => f.name).join(", ") || "Tất cả"}
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Mô tả</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Mô tả chi tiết sản phẩm sẽ được hiển thị tại đây. Nếu bạn cần thêm
              trường mô tả trong DB, hãy thêm vào select trong repository.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={() =>
                  addItem({
                    productId: p.id,
                    skuId: undefined,
                    slug: p.slug,
                    name: p.name,
                    image: p.imageUrl ?? "",
                    price: p.price,
                    quantity: 1,
                    stock: 9999,
                    brand: {
                      id: Number(p.categoryId),
                      name: p.category?.name ?? "",
                    },
                  })
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
