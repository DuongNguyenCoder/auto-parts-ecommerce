"use client";

import { createContext, use, useEffect, useMemo } from "react";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaPluginType } from "embla-carousel";

import { cn } from "@/lib/utils";

import { CAROUSEL_ARIA_LABELS, CAROUSEL_CLASSNAMES } from "./constants";

import { mergeCarouselOptions, mergeCarouselPlugins } from "./utils";

import { useCarousel } from "./hooks/use-carousel";
import { useCarouselControls } from "./hooks/use-carousel-controls";
import { useCarouselAutoplay } from "./hooks/use-carousel-autoplay";

import type { CarouselContextValue, CarouselProps } from "./types";

interface CarouselContextState extends CarouselContextValue {
  viewportRef: (node: HTMLDivElement | null) => void;

  controls: ReturnType<typeof useCarouselControls>;
}

const CarouselContext = createContext<CarouselContextState | null>(null);

export function useCarouselContext() {
  const context = use(CarouselContext);

  if (!context) {
    throw new Error("useCarouselContext must be used within <Carousel />");
  }

  return context;
}

export function Carousel({
  children,
  className,
  opts,
  plugins,
  autoplay,
  setApi,
}: CarouselProps) {
  const mergedOptions = useMemo(() => mergeCarouselOptions(opts), [opts]);

  const mergedPlugins = useMemo(
    () => mergeCarouselPlugins(plugins as EmblaPluginType[] | undefined),
    [plugins],
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(
    mergedOptions,
    mergedPlugins,
  );

  const carousel = useCarousel({
    api: emblaApi ?? null,
  });

  const controls = useCarouselControls({
    scrollPrev: carousel.scrollPrev,

    scrollNext: carousel.scrollNext,

    canScrollPrev: carousel.canScrollPrev,

    canScrollNext: carousel.canScrollNext,
  });

  const autoplayControls = useCarouselAutoplay({
    api: emblaApi ?? null,
    autoplay,
  });

  useEffect(() => {
    if (!emblaApi || !setApi) {
      return;
    }

    setApi(emblaApi as EmblaCarouselType);
  }, [emblaApi, setApi]);

  const contextValue = useMemo(
    () => ({
      ...carousel,
      viewportRef,
      controls,
    }),
    [carousel, viewportRef, controls],
  );

  return (
    <CarouselContext value={contextValue}>
      <section
        aria-label={CAROUSEL_ARIA_LABELS.REGION}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={controls.handleKeyDown}
        onMouseEnter={autoplayControls.eventHandlers.onMouseEnter}
        onMouseLeave={autoplayControls.eventHandlers.onMouseLeave}
        className={cn(CAROUSEL_CLASSNAMES.ROOT, className)}
      >
        {children}
      </section>
    </CarouselContext>
  );
}
