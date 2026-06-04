"use client";

import { memo } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNavigation,
} from "@/components/shared/carousel";
import BrandCard from "./brand-card";
import type { Brand, CarModel } from "@/types";

type SliderItem = {
  id: number;
  slug: string | null;
  name: string;
  imageUrl?: string | null;
};

interface BrandSliderProps {
  brands: SliderItem[];
  type?: "brand" | "model";
  className?: string;
  title?: string;
  itemsPerView?: number;
}

export const BrandSlider = memo(function BrandSlider({
  brands,
  type = "brand",
  className,
  title = "Browse by Brand",
  itemsPerView = 5,
}: BrandSliderProps) {
  if (!brands.length) {
    return null;
  }

  const shouldEnableCarousel = brands.length > itemsPerView;

  return (
    <section aria-label={title} className={cn("relative", className)}>
      <Carousel
        autoplay={
          shouldEnableCarousel
            ? {
                delay: 4000,
                pauseOnHover: true,
              }
            : false
        }
        opts={{
          loop: shouldEnableCarousel,
          align: "start",
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {brands.map((item) => {
            const href =
              type === "model"
                ? `/dong-xe/${item.slug}`
                : `/hang-xe/${item.slug}`;
            const content = <BrandCard brand={item} />;

            return (
              <CarouselItem
                key={item.id}
                className={cn(
                  "pl-3 md:pl-4",
                  "basis-1/2", // mobile: 2 per row
                  "xs:basis-1/3", // xs (≥480px): 3 per row
                  "sm:basis-1/4", // sm (≥640px): 4 per row
                  "md:basis-1/5", // md (≥768px): 5 per row
                  "lg:basis-1/6", // lg (≥1024px): 6 per row
                )}
              >
                <Link href={href} className="block h-full">
                  {content}
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {shouldEnableCarousel && (
          <>
            <CarouselNavigation variant="floating" />

            <CarouselDots
              variant="minimal"
              className="mt-5 static translate-x-0 justify-center"
            />
          </>
        )}
      </Carousel>
    </section>
  );
});

BrandSlider.displayName = "BrandSlider";
