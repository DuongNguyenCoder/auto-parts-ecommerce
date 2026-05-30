import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Giỏ hàng của bạn trống
      </h2>

      <p className="text-gray-600 mb-8 text-center max-w-sm">
        Hãy khám phá các sản phẩm phụ tùng ô tô chất lượng cao của chúng tôi
      </p>

      <Link href="/products">
        <Button size="lg">Tiếp tục mua sắm</Button>
      </Link>
    </div>
  );
}
