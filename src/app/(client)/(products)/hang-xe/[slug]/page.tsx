import { Car, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/client/breadcrumbs";
import { CarModelProductListServer } from "@/components/client/product/car-model-product-list-server";
import { BrandSlider } from "@/components/client/brand-carModel-category";
import { brandService } from "@/server/services/brands.service";

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await brandService.getBySlug(slug);

  if (!brand) return <div>Brand not found</div>;

  return (
    <div className="space-y-10 md:space-y-14">
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Hãng xe", href: "/san-pham" },
          { label: brand.name },
        ]}
        subtitle={`Phụ tùng ${brand?.name}.`}
      />

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Phụ tùng {brand.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
          Phụ tùng {brand.name} chính hãng giá tốt tại Auto Thọ Xuân
        </p>
        {/* Meta row */}
        <div className="flex items-center gap-4 pt-1">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Car size={13} className="shrink-0" />
            {brand.models?.length} dòng xe
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Truck size={13} className="shrink-0" />
            COD toàn quốc
          </span>
        </div>
      </div>

      {/* ── Model quick-nav ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Chọn dòng xe để xem phụ tùng liên quan
        </p>
        <BrandSlider brands={brand.models ?? []} type="model" />
      </div>

      {/* ── Product sections per model ───────────────────────────────────── */}
      <div className="divide-y divide-border/50">
        {brand.models?.map((model) => (
          <div key={model.id} className="pt-8 first:pt-0 pb-2">
            <CarModelProductListServer model={model} />
          </div>
        ))}
      </div>
    </div>
  );
}
