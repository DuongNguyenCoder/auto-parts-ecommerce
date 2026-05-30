import type { EmblaOptionsType, EmblaPluginType } from "embla-carousel";

import {
  CAROUSEL_AUTOPLAY_DEFAULTS,
  CAROUSEL_DEFAULT_OPTIONS,
} from "./constants";

import type { CarouselAutoplayOptions } from "./types";

export function mergeCarouselOptions(
  opts?: EmblaOptionsType,
): EmblaOptionsType {
  return {
    ...CAROUSEL_DEFAULT_OPTIONS,
    ...opts,
  };
}

export function normalizeAutoplayOptions(
  autoplay?: boolean | CarouselAutoplayOptions,
): Required<CarouselAutoplayOptions> | null {
  if (!autoplay) {
    return null;
  }

  if (autoplay === true) {
    return {
      ...CAROUSEL_AUTOPLAY_DEFAULTS,
    };
  }

  return {
    ...CAROUSEL_AUTOPLAY_DEFAULTS,
    ...autoplay,
  };
}

export function mergeCarouselPlugins(
  plugins?: EmblaPluginType[],
): EmblaPluginType[] {
  if (!plugins?.length) {
    return [];
  }

  return plugins.filter(Boolean);
}

export function getIsCarouselLooping(opts?: EmblaOptionsType): boolean {
  return Boolean(opts?.loop ?? CAROUSEL_DEFAULT_OPTIONS.loop);
}

export function canScrollPrevious(
  canScrollPrev: boolean,
  isLooping: boolean,
): boolean {
  return isLooping || canScrollPrev;
}

export function canScrollForward(
  canScrollNext: boolean,
  isLooping: boolean,
): boolean {
  return isLooping || canScrollNext;
}

export function clampIndex(index: number, max: number): number {
  return Math.max(0, Math.min(index, max));
}

export function isKeyboardNavigationKey(key: string): boolean {
  return key === "ArrowLeft" || key === "ArrowRight";
}
