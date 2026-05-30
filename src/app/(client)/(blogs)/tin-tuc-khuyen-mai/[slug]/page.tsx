import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CalendarDays, ChevronLeft } from "lucide-react";

import { postApi } from "@/features/api";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;

  const response = await postApi.getBySlug(slug);
  const post = response.data;

  if (!response.success || !post) {
    notFound();
  }

  const publishedDate = post.publishedAt ?? post.createdAt;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 lg:py-10">
        {/* Back */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 px-0 text-muted-foreground hover:bg-transparent"
        >
          <Link href="">
            <ChevronLeft className="mr-1 size-4" />
            Quay lại bài viết
          </Link>
        </Button>

        <article className="mx-auto max-w-5xl">
          {/* Hero */}
          <section className="space-y-6">
            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-3xl border bg-muted">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={post.thumbnail ?? "/images/placeholder-post.webp"}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
              </div>
            </div>

            {/* Header */}
            <div className="mx-auto max-w-4xl space-y-5">
              {post.category && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-4 py-1 text-sm"
                >
                  {post.category.name}
                </Badge>
              )}

              <div className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  <span>{formatDate(publishedDate)}</span>
                </div>

                <span>•</span>

                <span>Cập nhật {formatDate(post.updatedAt)}</span>
              </div>
            </div>
          </section>

          <Separator className="my-10" />

          {/* Content */}
          <section className="mx-auto max-w-4xl">
            <div
              className={cn(
                "prose prose-zinc max-w-none",
                "prose-headings:scroll-mt-24",
                "prose-img:rounded-2xl",
                "prose-img:border",
                "prose-a:text-primary",
                "prose-p:leading-8",
                "prose-li:leading-8",
                "prose-h2:mt-12 prose-h2:text-3xl",
                "prose-h3:text-2xl",
                "dark:prose-invert",
              )}
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          </section>

          {/* Related Products */}
          {!!post.relatedProducts?.length && (
            <section className="mt-20 border-t pt-10">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Sản phẩm liên quan
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Các sản phẩm được đề xuất trong bài viết này
                  </p>
                </div>
              </div>

              {/* Replace bằng product slider/grid của bạn */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {post.relatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/${product.slug}`}
                    className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-sm"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <Image
                        src={
                          product.imageUrl ?? "/images/product-placeholder.webp"
                        }
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="space-y-2 p-4">
                      <h3 className="line-clamp-2 text-sm font-medium">
                        {product.name}
                      </h3>

                      <p className="font-semibold">
                        {Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
