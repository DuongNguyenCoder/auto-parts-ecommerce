import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import type { ReactNode } from "react";

export interface CarouselAutoplayOptions {
  /**
   * Delay between slide transitions (ms)
   * @default 4000
   */
  delay?: number;

  /**
   * Stop autoplay on mouse hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Stop autoplay when user interacts
   * @default true
   */
  pauseOnInteraction?: boolean;

  /**
   * Stop autoplay when tab/window hidden
   * @default true
   */
  stopOnVisibilityChange?: boolean;
}

export interface CarouselContextValue {
  api: EmblaCarouselType | null;

  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;

  canScrollPrev: boolean;
  canScrollNext: boolean;

  selectedIndex: number;
  scrollSnaps: number[];

  isDragging: boolean;
}

export interface CarouselProps {
  children: ReactNode;

  className?: string;

  /**
   * Embla configuration
   */
  opts?: EmblaOptionsType;

  /**
   * Embla plugins
   */
  plugins?: unknown[];

  /**
   * Enable autoplay
   */
  autoplay?: boolean | CarouselAutoplayOptions;

  /**
   * Expose Embla API
   */
  setApi?: (api: EmblaCarouselType) => void;
}

export interface CarouselContentProps {
  children: ReactNode;
  className?: string;
}

export interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export interface CarouselNavigationProps {
  className?: string;

  prevLabel?: string;
  nextLabel?: string;

  iconClassName?: string;
}

export type CarouselDotsVariant = "default" | "hero" | "minimal";

export interface CarouselDotsProps {
  className?: string;

  dotClassName?: string;

  activeDotClassName?: string;

  variant?: CarouselDotsVariant;
}

export type CarouselNavigationVariant = "default" | "hero" | "floating";

export interface CarouselNavigationProps {
  className?: string;

  prevLabel?: string;
  nextLabel?: string;

  iconClassName?: string;

  variant?: CarouselNavigationVariant;
}
