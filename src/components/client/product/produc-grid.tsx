// grid/ProductGrid.tsx

import { ProductCard } from "./product-cart";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  loading?: boolean;
};

export function ProductGrid({ products, loading }: Props) {
  if (loading) return <div>Loading...</div>;

  if (!products.length) {
    return <div>No products found</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
