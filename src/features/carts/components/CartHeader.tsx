import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
}

export function CartHeader({ itemCount, onClearCart }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
        <p className="text-gray-600 mt-1">
          {itemCount} {itemCount === 1 ? "sản phẩm" : "sản phẩm"}
        </p>
      </div>

      {itemCount > 0 && (
        <Button
          variant="outline"
          onClick={onClearCart}
          className="text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa tất cả
        </Button>
      )}
    </div>
  );
}
