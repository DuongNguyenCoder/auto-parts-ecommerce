"use client";

import { memo } from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { useCarouselContext } from "./carousel";

import { CAROUSEL_ARIA_LABELS } from "./constants";

import type { CarouselDotsProps } from "./types";

const dotsWrapperVariants = cva(
  ["absolute z-20", "flex items-center justify-center", "gap-2"],
  {
    variants: {
      variant: {
        default: "left-1/2 bottom-4 -translate-x-1/2",

        hero: "left-1/2 bottom-6 -translate-x-1/2 md:bottom-8",

        minimal: "left-1/2 bottom-2 -translate-x-1/2",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

const dotVariants = cva(
  [
    "relative shrink-0 rounded-full",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "h-2 w-2",
          "bg-muted-foreground/30",
          "hover:bg-muted-foreground/50",
        ],

        hero: [
          "h-2.5 w-2.5",
          "bg-white/40",
          "backdrop-blur-sm",
          "hover:bg-white/60",
        ],

        minimal: ["h-1.5 w-1.5", "bg-muted-foreground/20"],
      },

      active: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        variant: "default",
        active: true,
        className: "w-6 bg-primary",
      },

      {
        variant: "hero",
        active: true,
        className: "w-8 bg-white",
      },

      {
        variant: "minimal",
        active: true,
        className: "w-4 bg-primary",
      },
    ],

    defaultVariants: {
      variant: "default",
      active: false,
    },
  },
);

export const CarouselDots = memo(function CarouselDots({
  className,
  dotClassName,
  activeDotClassName,
  variant = "default",
}: CarouselDotsProps) {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarouselContext();

  if (!scrollSnaps.length) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label={CAROUSEL_ARIA_LABELS.PAGINATION}
      className={cn(
        dotsWrapperVariants({
          variant,
        }),
        className,
      )}
    >
      {scrollSnaps.map((_, index) => {
        const isActive = selectedIndex === index;

        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={CAROUSEL_ARIA_LABELS.GO_TO_SLIDE(index)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => scrollTo(index)}
            className={cn(
              dotVariants({
                variant,
                active: isActive,
              }),

              dotClassName,

              isActive && activeDotClassName,
            )}
          />
        );
      })}
    </div>
  );
});

CarouselDots.displayName = "CarouselDots";
