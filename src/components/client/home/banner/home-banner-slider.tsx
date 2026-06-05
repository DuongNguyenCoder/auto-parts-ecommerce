"use client";

import { memo, useEffect, useMemo, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNavigation,
} from "@/components/shared/carousel";

import { BannerSkeleton } from "./banner-skeleton";
import { BannerSlide } from "./banner-slide";

import type { Banner } from "@/types";
import { bannerApi } from "@/features/banners/api/banner.api";

interface HomeBannerSliderProps {
  className?: string;
}

export const HomeBannerSlider = memo(function HomeBannerSlider({
  className,
}: HomeBannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBanners() {
      try {
        const response = await bannerApi.getAll({
          skip: 0,
          take: 10,
          isActive: true,
        });
        console.log("response banner => ", response);

        if (!response.success) {
          return;
        }

        const activeBanners = response?.data?.items;
        // .sort((a, b) => a.sortOrder - b.sortOrder);

        if (!isMounted) {
          return;
        }

        setBanners(activeBanners ?? []);
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasBanners = banners.length > 0;

  const shouldShowNavigation = banners.length > 1;
  console.log("Banner ====> ", banners);
  const renderedSlides = useMemo(
    () =>
      banners.map((banner, index) => (
        <CarouselItem key={banner.id}>
          <BannerSlide banner={banner} index={index} />
        </CarouselItem>
      )),
    [banners],
  );

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (!hasBanners) {
    return null;
  }

  return (
    <section aria-label="Homepage banners" className={className}>
      <Carousel
        autoplay={{
          delay: 5000,
          pauseOnHover: true,
        }}
        opts={{
          loop: banners.length > 1,
          align: "center",
        }}
      >
        <CarouselContent>{renderedSlides}</CarouselContent>

        {shouldShowNavigation && <CarouselNavigation variant="hero" />}

        {shouldShowNavigation && <CarouselDots variant="hero" />}
      </Carousel>
    </section>
  );
});

HomeBannerSlider.displayName = "HomeBannerSlider";
