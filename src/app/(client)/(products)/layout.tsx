import { CartWishlistSyncProvider } from "@/features/carts/providers/cart-wishlist-sync-provider";

export const dynamic = "force-dynamic";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5">
      <CartWishlistSyncProvider>{children}</CartWishlistSyncProvider>
    </div>
  );
}
