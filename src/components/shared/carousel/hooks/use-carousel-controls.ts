"use client";

import { useCallback, useMemo } from "react";

import type { KeyboardEvent } from "react";

import { KEYBOARD_KEYS } from "../constants";

import { isKeyboardNavigationKey } from "../utils";

interface UseCarouselControlsParams {
  scrollPrev: () => void;
  scrollNext: () => void;

  canScrollPrev: boolean;
  canScrollNext: boolean;
}

interface UseCarouselControlsReturn {
  handlePrevious: () => void;
  handleNext: () => void;

  handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void;

  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

export function useCarouselControls({
  scrollPrev,
  scrollNext,

  canScrollPrev,
  canScrollNext,
}: UseCarouselControlsParams): UseCarouselControlsReturn {
  const handlePrevious = useCallback(() => {
    if (!canScrollPrev) {
      return;
    }

    scrollPrev();
  }, [canScrollPrev, scrollPrev]);

  const handleNext = useCallback(() => {
    if (!canScrollNext) {
      return;
    }

    scrollNext();
  }, [canScrollNext, scrollNext]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const { key } = event;

      if (!isKeyboardNavigationKey(key)) {
        return;
      }

      event.preventDefault();

      switch (key) {
        case KEYBOARD_KEYS.PREV:
          if (canScrollPrev) {
            scrollPrev();
          }
          break;

        case KEYBOARD_KEYS.NEXT:
          if (canScrollNext) {
            scrollNext();
          }
          break;
      }
    },
    [canScrollPrev, canScrollNext, scrollPrev, scrollNext],
  );

  return useMemo(
    () => ({
      handlePrevious,
      handleNext,

      handleKeyDown,

      isPrevDisabled: !canScrollPrev,

      isNextDisabled: !canScrollNext,
    }),
    [handlePrevious, handleNext, handleKeyDown, canScrollPrev, canScrollNext],
  );
}
