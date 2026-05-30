"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";

type Props = {
  product: Product;
};

export default function ProductGallery({ product }: Props) {
  const images = product.imageUrl ? [product.imageUrl] : [];
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden bg-muted">
        <div className="relative aspect-4/3">
          {images[index] ? (
            <Image
              src={images[index]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain p-4"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border ${
                i === index ? "border-primary" : "border-border"
              }`}
            >
              <Image
                src={src}
                alt={`thumb-${i}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
