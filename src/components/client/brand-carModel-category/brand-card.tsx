import { cn } from "@/lib/utils";
import type { Brand, CarModel } from "@/types";
import Image from "next/image";

type SliderItem = Brand | CarModel;

export default function BrandCard({ brand }: { brand: SliderItem }) {
  return (
    <article
      className={cn(
        "group h-full overflow-hidden rounded-2xl border bg-background transition-all duration-300",
        "hover:border-primary/20 hover:shadow-md",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-4",
          "min-h-[120px] md:min-h-[140px]",
        )}
      >
        <div
          className={cn(
            "relative w-full aspect-1/1 rounded-md overflow-hidden",
          )}
        >
          {brand?.imageUrl && (
            <Image
              src={brand.imageUrl}
              alt={brand.name}
              fill
              loading="lazy"
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 768px) 25vw,
                16vw
                "
              className={cn(
                "object-cover transition-transform duration-500",
                "group-hover:scale-105",
              )}
            />
          )}
        </div>

        <h3
          className={cn(
            "line-clamp-1 text-center text-sm font-semibold md:text-base  uppercase",
          )}
        >
          {brand.name}
        </h3>
      </div>
    </article>
  );
}
