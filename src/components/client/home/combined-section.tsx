import { BrandSlider } from "@/components/client/brand-carModel-category/brand-slider";
import { BrandSectionContainer } from "@/components/client/product/brand-product-container";
import { cn } from "@/lib/utils";
import { brandService } from "@/server/services/brands.service";
import { categoryService } from "@/server/services/categories.service";

type CombinedSectionProps = {
  className?: string;
};

export default async function CombinedSection({
  className,
}: CombinedSectionProps) {
  // const [brandsRes, categoriesRes] = await Promise.all([
  //   brandApi.getAll(),
  //   categoryApi.getAll(),
  // ]);
  const brandsRes = await brandService.list({}, { take: 100 });
  const categoriesRes = await categoryService.list({}, { take: 100 });
  const brands = brandsRes?.items ?? [];
  const categories = categoriesRes?.items ?? [];

  return (
    <div
      aria-label="Combined section"
      className={cn("space-y-12 md:space-y-16", className)}
    >
      {/* Block 1 — Brand Slider */}
      <div className="space-y-3">
        <p className="text-[13px] font-medium uppercase tracking-widest text-muted-foreground">
          Chọn hãng xe
        </p>
        <BrandSlider brands={brands} itemsPerView={4} />
      </div>

      {/* Block 2 — Brand Product Sections */}
      <div className="space-y-6 md:space-y-8">
        {/* Section heading */}
        <div className="flex items-center gap-4">
          <div className="h-[1.5px] flex-1 bg-border/50" />
          <h2 className="text-base font-semibold border uppercase text-center border-border rounded-md py-2 px-3 tracking-tight text-foreground sm:text-lg lg:text-xl xl:text-2xl">
            Auto Thọ Xuân - Phụ&nbsp;tùng chính&nbsp;hãng giá tốt
          </h2>
          <div className="h-[1.5px] flex-1 bg-border/50" />
        </div>

        <BrandSectionContainer brands={brands} categories={categories} />
      </div>
    </div>
  );
}
