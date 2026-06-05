import { ProductListingEngine } from "@/components/client/product/product-listing-engine";
import { Breadcrumbs } from "@/components/client/breadcrumbs";
import { buildBreadcrumbsFromPath } from "@/lib/breadcrumb";
import { BrandSlider } from "@/components/client/brand-carModel-category";
import { BrandGrid } from "@/components/client/brand-carModel-category";
import { Tag } from "lucide-react";
import { productService } from "@/server/services/products.service";
import { categoryService } from "@/server/services/categories.service";
import { brandService } from "@/server/services/brands.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm phụ tùng xe tải chính hãng giá tốt",
  description:
    "Chuyên cung cấp phụ tùng xe tải chính hãng cho nhiều dòng xe phổ biến tại Việt Nam. Hỗ trợ tra mã phụ tùng, tư vấn kỹ thuật và giao hàng nhanh toàn quốc.",
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const productsRes = await productService.list({}, { take: 10 }, {});
  const categoriesRes = await categoryService.list({}, { take: 100 });
  const brandsRes = await brandService.list({}, { take: 100 });

  return (
    <div className="min-h-screen">
      {/* ── Brands section ───────────────────────────────────────────────────── */}
      <section className="bg-muted/30 border-b border-border/50 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Label row */}
          <div className="flex items-start gap-3 mb-5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Tag size={14} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground leading-snug">
                Phụ tùng theo hãng xe
              </h2>
              <p className="mt-0.5 text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
                Mua phụ tùng chính hãng giá tốt tại Auto&nbsp;Thọ&nbsp;Xuân -
                chọn hãng xe để xem danh sách phụ tùng phù hợp
              </p>
            </div>
          </div>

          {/* Mobile: slider / Desktop: grid */}
          <div className="md:hidden">
            <BrandSlider brands={brandsRes?.items ?? []} itemsPerView={4} />
          </div>
          <div className="hidden md:block">
            <BrandGrid brands={brandsRes?.items ?? []} />
          </div>
        </div>
      </section>

      {/* ── Products section ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 max-w-7xl py-6 md:py-8">
        <Breadcrumbs
          items={buildBreadcrumbsFromPath("/san-pham")}
          title="Sản phẩm"
          subtitle="Tìm nhanh phụ tùng chính hãng, lọc theo hãng và danh mục để chọn được sản phẩm phù hợp."
          className="mb-8"
        />

        <ProductListingEngine
          initialResponse={productsRes}
          initialItems={productsRes.items ?? []}
          categories={categoriesRes?.items ?? []}
        />
      </section>
    </div>
  );
}
