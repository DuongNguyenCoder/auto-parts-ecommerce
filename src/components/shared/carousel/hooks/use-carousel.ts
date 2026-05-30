"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { EmblaCarouselType } from "embla-carousel";

import {
  canScrollForward,
  canScrollPrevious,
  getIsCarouselLooping,
} from "../utils";

import type { CarouselContextValue } from "../types";

interface UseCarouselParams {
  api: EmblaCarouselType | null;
}

interface UseCarouselReturn extends CarouselContextValue {}

export function useCarousel({ api }: UseCarouselParams): UseCarouselReturn {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);

  const [canScrollNext, setCanScrollNext] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    const isLooping = getIsCarouselLooping(emblaApi.internalEngine().options);

    setSelectedIndex(emblaApi.selectedScrollSnap());

    setCanScrollPrev(canScrollPrevious(emblaApi.canScrollPrev(), isLooping));

    setCanScrollNext(canScrollForward(emblaApi.canScrollNext(), isLooping));
  }, []);

  const onPointerDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setScrollSnaps(api.scrollSnapList());

    onSelect(api);

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    api.on("pointerDown", onPointerDown);

    api.on("pointerUp", onPointerUp);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);

      api.off("pointerDown", onPointerDown);

      api.off("pointerUp", onPointerUp);
    };
  }, [api, onSelect, onPointerDown, onPointerUp]);

  return useMemo(
    () => ({
      api,

      scrollPrev,
      scrollNext,
      scrollTo,

      canScrollPrev,
      canScrollNext,

      selectedIndex,
      scrollSnaps,

      isDragging,
    }),
    [
      api,
      scrollPrev,
      scrollNext,
      scrollTo,

      canScrollPrev,
      canScrollNext,

      selectedIndex,
      scrollSnaps,

      isDragging,
    ],
  );
}
