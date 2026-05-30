"use client";

import { memo } from "react";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { Banner } from "@/types";

interface BannerSlideProps {
  banner: Banner;

  index: number;

  className?: string;
}

export const BannerSlide = memo(function BannerSlide({
  banner,
  index,
  className,
}: BannerSlideProps) {
  const { title, imageUrl, link } = banner;

  const isPriority = index === 0;

  const content = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-b-2xl bg-muted",
        className,
      )}
    >
      <div
        className={cn(
          // Mobile
          "aspect-[16/9]",
          "md:aspect-7/3",
        )}
      >
        <Image
          src={imageUrl}
          alt={title ?? `Banner ${index + 1}`}
          fill
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          sizes="
              (max-width: 768px) 100vw,
              (max-width: 1280px) 100vw,
              1400px
            "
          className={cn(
            "object-cover",
            "transition-transform duration-500",
            "group-hover:scale-[1.02]",
          )}
        />
      </div>

      {/* subtle overlay */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-gradient-to-t",
          "from-black/5 via-transparent to-transparent",
        )}
      />
    </div>
  );

  if (!link) {
    return content;
  }

  const isExternal = /^https?:\/\//.test(link);

  return (
    <Link
      href={link}
      aria-label={title ?? `Open banner ${index + 1}`}
      prefetch={false}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block"
    >
      {content}
    </Link>
  );
});

BannerSlide.displayName = "BannerSlide";
