import { productService } from "@/server/services/products.service";
import ProductDetailClient from "@/features/products/components/ProductDetailClient";
import { productApi } from "@/features/products/api/product.api";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  const related = await productService.list(
    { categoryId: product?.categoryId },
    {
      take: 4,
    },
    {},
  );

  if (!product) return <div>Product not found</div>;

  // Fetch a few related products in the same category to show as recommendations

  return (
    <ProductDetailClient product={product} related={related.items ?? []} />
  );
}
