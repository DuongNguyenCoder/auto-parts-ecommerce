"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight, Package2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import { formatDate } from "@/lib/format-date";

type Props = {
  post: Post;
  className?: string;
};

export function PostCard({ post, className }: Props) {
  const hasThumbnail = Boolean(post.thumbnail);
  const hasCategory = Boolean(post.category);
  const hasRelatedProducts = post.relatedProducts.length > 0;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border bg-background transition-all duration-200 hover:border-primary/30 hover:shadow-sm",
        className,
      )}
    >
      <Link
        href={`/tin-tuc-khuyen-mai/${post.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {hasThumbnail ? (
            <Image
              src={post.thumbnail!}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              priority={false}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          )}

          {/* Category */}
          {hasCategory && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                {post.category?.name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4 p-5">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {post.publishedAt && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            )}

            {hasRelatedProducts && (
              <div className="flex items-center gap-1.5">
                <Package2 className="size-3.5" />
                <span>{post.relatedProducts.length} related products</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
              {post.title}
            </h3>

            {post.excerpt && (
              <div
                className="line-clamp-3 text-sm leading-6 text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-primary">Chi tiết</span>

            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
