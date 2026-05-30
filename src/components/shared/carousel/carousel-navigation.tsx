"use client";

import { memo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { useCarouselContext } from "./carousel";

import { CAROUSEL_ARIA_LABELS } from "./constants";

import type { CarouselNavigationProps } from "./types";

const navigationWrapperVariants = cva(
  "pointer-events-none absolute inset-y-0 z-20 flex items-center justify-between",
  {
    variants: {
      variant: {
        default: "left-0 right-0 px-2",

        hero: "left-0 right-0 px-4 md:px-6",

        floating: "-left-4 -right-4",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

const navigationButtonVariants = cva(
  [
    "pointer-events-auto",
    "h-10 w-10 rounded-full",
    "transition-all duration-200",
    "shadow-sm",
    "disabled:pointer-events-none",
    "disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        default: ["bg-background/90", "border", "hover:bg-background"],

        hero: [
          "bg-background/70",
          "backdrop-blur-md",
          "hover:bg-background/90",
        ],

        floating: ["bg-background", "border shadow-md", "hover:scale-105"],
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export const CarouselNavigation = memo(function CarouselNavigation({
  className,
  iconClassName,

  prevLabel = CAROUSEL_ARIA_LABELS.PREVIOUS_SLIDE,

  nextLabel = CAROUSEL_ARIA_LABELS.NEXT_SLIDE,

  variant = "default",
}: CarouselNavigationProps) {
  const { controls } = useCarouselContext();

  return (
    <div
      aria-hidden="true"
      className={cn(
        navigationWrapperVariants({
          variant,
        }),
        className,
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={prevLabel}
        disabled={controls.isPrevDisabled}
        onClick={controls.handlePrevious}
        className={cn(
          navigationButtonVariants({
            variant,
          }),
        )}
      >
        <ChevronLeft className={cn("size-5", iconClassName)} />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={nextLabel}
        disabled={controls.isNextDisabled}
        onClick={controls.handleNext}
        className={cn(
          navigationButtonVariants({
            variant,
          }),
        )}
      >
        <ChevronRight className={cn("size-5", iconClassName)} />
      </Button>
    </div>
  );
});

CarouselNavigation.displayName = "CarouselNavigation";
