import { Breadcrumbs } from "@/components/client/breadcrumbs";
import { ProductListingEngine } from "@/components/client/product/product-listing-engine";
import { Calendar, Truck } from "lucide-react";
import Link from "next/link";
import { carModelService } from "@/server/services/car-models.service";
import { productService } from "@/server/services/products.service";
import { categoryService } from "@/server/services/categories.service";

export default async function CarModelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carModel = await carModelService.getBySlug(slug);

  const productsRes = await productService.list(
    { carModelId: carModel?.id },
    {
      take: 10,
    },
    {},
  );

  const categoriesRes = await categoryService.list({}, { take: 100 });
  const categories = categoriesRes?.items || [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-10">
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          ...(carModel?.brand
            ? [
                {
                  label: carModel.brand.name,
                  href: `/hang-xe/${carModel.brand.slug}`,
                },
              ]
            : []),
          { label: carModel?.name ?? "Dòng xe" },
        ]}
        subtitle={`Phụ tùng ${carModel?.name}.`}
        className="mb-8"
      />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="mb-8 md:mb-10 space-y-2">
        {/* Breadcrumb context */}
        {carModel?.brand?.name && (
          <Link
            href={`/hang-xe/${carModel.brand.slug}`}
            className="text-xs sm:text-sm bg-sky-300/80  px-2 py-1 rounded-md border text-center border-accent text-foreground uppercase tracking-wider font-medium"
          >
            {carModel.brand.name}
          </Link>
        )}

        {/* Model name */}
        <h1 className="text-2xl mt-1 sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {carModel?.name}
        </h1>

        {/* Meta row */}
        {carModel?.year && (
          <div className="flex items-center gap-3 pt-0.5">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Calendar size={13} className="shrink-0" />
              {carModel.year}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <Truck size={13} className="shrink-0" />
              COD toàn quốc
            </span>
          </div>
        )}
      </header>

      {/* ── Products ─────────────────────────────────────────────────── */}
      <ProductListingEngine
        initialResponse={productsRes}
        initialItems={productsRes.items}
        categories={categories}
        lockedCarModelId={carModel?.id}
      />
    </div>
  );
}
