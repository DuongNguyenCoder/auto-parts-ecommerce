import type { CarouselAutoplayOptions } from "./types";

export const CAROUSEL_DEFAULT_OPTIONS = {
  align: "start",
  loop: false,
  dragFree: false,
  skipSnaps: false,
  containScroll: "trimSnaps",
  watchDrag: true,
  watchResize: true,
  watchSlides: true,
} as const;

export const CAROUSEL_AUTOPLAY_DEFAULTS: Required<CarouselAutoplayOptions> = {
  delay: 4000,

  pauseOnHover: true,

  pauseOnInteraction: true,

  stopOnVisibilityChange: true,
};

export const CAROUSEL_TRANSITION_DURATION = 300;

export const KEYBOARD_KEYS = {
  PREV: "ArrowLeft",
  NEXT: "ArrowRight",
} as const;

export const CAROUSEL_ARIA_LABELS = {
  REGION: "Carousel",

  PREVIOUS_SLIDE: "Previous slide",

  NEXT_SLIDE: "Next slide",

  PAGINATION: "Carousel pagination",

  GO_TO_SLIDE: (index: number) => `Go to slide ${index + 1}`,
} as const;

export const CAROUSEL_CLASSNAMES = {
  ROOT: "relative",

  VIEWPORT: "overflow-hidden",

  CONTAINER: "flex touch-pan-y",

  ITEM: "min-w-0 shrink-0 grow-0 basis-full",
} as const;
