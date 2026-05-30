import { memo } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

interface BannerSkeletonProps {
  className?: string;
}

export const BannerSkeleton = memo(function BannerSkeleton({
  className,
}: BannerSkeletonProps) {
  return (
    <section
      aria-label="Loading banners"
      className={cn("relative overflow-hidden rounded-2xl", className)}
    >
      <Skeleton
        className={cn(
          "w-full rounded-2xl",

          // Mobile
          "aspect-[16/10]",

          // Tablet
          "md:aspect-[21/9]",

          // Desktop
          "xl:aspect-[21/8]",
        )}
      />

      {/* shimmer overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 overflow-hidden rounded-2xl",
          "before:absolute before:inset-0",
          "before:-translate-x-full",
          "before:animate-[shimmer_2s_infinite]",
          "before:bg-gradient-to-r",
          "before:from-transparent",
          "before:via-white/10",
          "before:to-transparent",
        )}
      />
    </section>
  );
});

BannerSkeleton.displayName = "BannerSkeleton";
