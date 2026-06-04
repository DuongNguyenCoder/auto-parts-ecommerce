import { Brand, Category } from "@/types";
import { BrandProductSection } from "./brand-product-section";
import { CartWishlistSyncProvider } from "@/features/carts/providers/cart-wishlist-sync-provider";

type BrandSectionContainerProps = {
  brands: any[];
  categories: Category[];
};

export function BrandSectionContainer({
  brands,
  categories,
}: BrandSectionContainerProps) {
  if (!brands?.length) return null;
  return (
    <CartWishlistSyncProvider>
      <section className="w-full space-y-10 md:space-y-14">
        {brands.map((brand) => (
          <BrandProductSection
            key={brand.id}
            brand={brand}
            carModels={brand.models ?? []}
            categories={categories}
            className="rounded-xl border border-accent/20 px-3 py-5 sm:px-5 sm:py-6 md:px-6"
          />
        ))}
      </section>
    </CartWishlistSyncProvider>
  );
}
