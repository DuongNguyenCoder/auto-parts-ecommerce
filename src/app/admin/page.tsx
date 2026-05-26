import { productApi } from "@/features/products/api/product.api";
import { ProductForm } from "@/features/products/components/product-form";

export default async function AdminPage() {
  const getProducts = await productApi.getAll();
  console.log("GET PRODUCTS ==> ", getProducts);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950">Admin</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage products, posts, banners, and catalog data.
        </p>
      </div>
    </main>
  );
}
