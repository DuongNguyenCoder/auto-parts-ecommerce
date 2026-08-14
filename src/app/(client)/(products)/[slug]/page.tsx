import { productService } from "@/server/services/products.service";
import ProductDetailClient from "@/features/products/components/ProductDetailClient";

export const revalidate = 600;

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

  return (
    <ProductDetailClient product={product} related={related.items ?? []} />
  );
}
