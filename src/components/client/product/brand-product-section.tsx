"use client";

import {
  CarModelTabs,
  CategoryTabs,
  SectionHeader,
  useBrandProducts,
} from "@/components/client/brand-carModel-category";
import { ProductSlider } from "@/components/client/product";
import { cn } from "@/lib/utils";
import { Brand, CarModel, Category } from "@/types";
import { ClipboardX } from "lucide-react";

type BrandProductSectionProps = {
  brand: Brand;
  carModels: CarModel[];
  categories: Category[];
  className?: string;
};

export function BrandProductSection({
  brand,
  carModels,
  categories,
  className,
}: BrandProductSectionProps) {
  const {
    products,
    loading,
    carModelId,
    setCarModelId,
    categoryId,
    setCategoryId,
  } = useBrandProducts({
    brandId: brand?.id,
    initialCarModelId: carModels?.[0]?.id,
    initialCategoryId: categories?.[0]?.id,
  });
  console.log("Check CarModel inHomePage => ", carModels);
  if (!carModels.length) return null;
  return (
    <section className={cn("space-y-0", className)}>
      {/* Header */}
      <SectionHeader title={brand.name} className="mb-4" />

      {/* Filter panel */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        {/* Car model row */}
        <div className="border-b border-border/40 bg-muted/30 px-3 pb-2 pt-3 sm:px-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:text-[11px]">
            Dòng xe
          </p>
          <CarModelTabs
            items={carModels}
            value={carModelId}
            onChange={setCarModelId}
          />
        </div>

        {/* Category row */}
        <div className="px-3 pb-0 pt-2 sm:px-4">
          <CategoryTabs
            items={categories}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>
      </div>

      {/* Product slider */}
      <div className="pt-4">
        {products.length > 0 ? (
          <ProductSlider products={products} loading={loading} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

const EmptyState = () => {
  return (
    <div
      className="
    flex min-h-[280px]
    flex-col items-center
    justify-center rounded-[2rem]
    border border-dashed
    bg-muted/20 px-6 py-12
    text-center
  "
    >
      <div
        className="
      mb-5 flex size-20
      items-center justify-center
      rounded-full
      bg-muted
      text-muted-foreground
    "
      >
        <ClipboardX className="size-10" />
      </div>

      <h3 className="text-lg font-semibold">Chưa có sản phẩm</h3>

      <p
        className="
      mt-2 max-w-sm
      text-sm leading-6
      text-muted-foreground
    "
      >
        Hiện tại chưa có sản phẩm phù hợp để hiển thị. Vui lòng quay lại sau
        hoặc thử bộ lọc khác.
      </p>
    </div>
  );
};
