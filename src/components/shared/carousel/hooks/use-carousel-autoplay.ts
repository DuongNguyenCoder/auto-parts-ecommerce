"use client";

import { useCallback, useEffect, useRef } from "react";

import type { EmblaCarouselType } from "embla-carousel";

import { normalizeAutoplayOptions } from "../utils";

import type { CarouselAutoplayOptions } from "../types";

interface UseCarouselAutoplayParams {
  api: EmblaCarouselType | null;

  autoplay?: boolean | CarouselAutoplayOptions;
}

interface UseCarouselAutoplayReturn {
  pause: () => void;
  resume: () => void;

  isPaused: () => boolean;

  eventHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export function useCarouselAutoplay({
  api,
  autoplay,
}: UseCarouselAutoplayParams): UseCarouselAutoplayReturn {
  const autoplayOptions = normalizeAutoplayOptions(autoplay);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const pausedRef = useRef(false);

  const interactionPausedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (!intervalRef.current) {
      return;
    }

    clearInterval(intervalRef.current);

    intervalRef.current = null;
  }, []);

  const play = useCallback(() => {
    if (!api || !autoplayOptions || pausedRef.current) {
      return;
    }

    clearTimer();

    intervalRef.current = setInterval(() => {
      if (document.hidden) {
        return;
      }

      if (pausedRef.current) {
        return;
      }

      api.scrollNext();
    }, autoplayOptions.delay);
  }, [api, autoplayOptions, clearTimer]);

  const pause = useCallback(() => {
    pausedRef.current = true;

    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    pausedRef.current = false;

    play();
  }, [play]);

  const handleMouseEnter = useCallback(() => {
    if (!autoplayOptions?.pauseOnHover) {
      return;
    }

    pause();
  }, [autoplayOptions, pause]);

  const handleMouseLeave = useCallback(() => {
    if (!autoplayOptions?.pauseOnHover) {
      return;
    }

    if (interactionPausedRef.current) {
      return;
    }

    resume();
  }, [autoplayOptions, resume]);

  const handlePointerDown = useCallback(() => {
    if (!autoplayOptions?.pauseOnInteraction) {
      return;
    }

    interactionPausedRef.current = true;

    pause();
  }, [autoplayOptions, pause]);

  const handlePointerUp = useCallback(() => {
    if (!autoplayOptions?.pauseOnInteraction) {
      return;
    }

    interactionPausedRef.current = false;

    resume();
  }, [autoplayOptions, resume]);

  const handleVisibilityChange = useCallback(() => {
    if (!autoplayOptions?.stopOnVisibilityChange) {
      return;
    }

    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  }, [autoplayOptions, pause, resume]);

  useEffect(() => {
    if (!api || !autoplayOptions) {
      return;
    }

    play();

    api.on("pointerDown", handlePointerDown);

    api.on("pointerUp", handlePointerUp);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimer();

      api.off("pointerDown", handlePointerDown);

      api.off("pointerUp", handlePointerUp);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    api,
    autoplayOptions,
    play,
    clearTimer,
    handlePointerDown,
    handlePointerUp,
    handleVisibilityChange,
  ]);

  return {
    pause,
    resume,

    isPaused: () => pausedRef.current,

    eventHandlers: {
      onMouseEnter: handleMouseEnter,

      onMouseLeave: handleMouseLeave,
    },
  };
}
