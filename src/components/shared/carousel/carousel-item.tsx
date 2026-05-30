"use client";

import { forwardRef, memo } from "react";

import { cn } from "@/lib/utils";

import { CAROUSEL_CLASSNAMES } from "./constants";

import { useCarouselContext } from "./carousel";

import type { CarouselItemProps } from "./types";

export const CarouselItem = memo(
  forwardRef<HTMLDivElement, CarouselItemProps>(
    ({ children, className }, ref) => {
      const { isDragging } = useCarouselContext();

      return (
        <div
          ref={ref}
          role="listitem"
          aria-roledescription="slide"
          data-dragging={isDragging ? "true" : "false"}
          className={cn(CAROUSEL_CLASSNAMES.ITEM, className)}
        >
          {children}
        </div>
      );
    },
  ),
);

CarouselItem.displayName = "CarouselItem";
