"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import { CAROUSEL_CLASSNAMES } from "./constants";

import { useCarouselContext } from "./carousel";

import type { CarouselContentProps } from "./types";

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ children, className }, ref) => {
    const { viewportRef } = useCarouselContext();

    return (
      <div
        ref={(node) => {
          viewportRef(node);

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(CAROUSEL_CLASSNAMES.VIEWPORT)}
      >
        <div
          role="list"
          aria-live="polite"
          className={cn(CAROUSEL_CLASSNAMES.CONTAINER, className)}
        >
          {children}
        </div>
      </div>
    );
  },
);

CarouselContent.displayName = "CarouselContent";
