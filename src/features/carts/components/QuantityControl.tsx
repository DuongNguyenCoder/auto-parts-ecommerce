"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface QuantityControlProps {
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
  isLoading?: boolean;
}

export function QuantityControl({
  quantity,
  stock,
  onQuantityChange,
  isLoading = false,
}: QuantityControlProps) {
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);

    if (isNaN(numValue) || numValue < 1) {
      setInputValue(String(quantity));
    } else if (numValue > stock) {
      onQuantityChange(stock);
    } else if (numValue !== quantity) {
      onQuantityChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg w-fit">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={isLoading || quantity <= 1}
        className="h-8 w-8 p-0"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        min="1"
        max={stock}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="h-8 w-12 text-center border-0 focus-visible:ring-0"
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={isLoading || quantity >= stock}
        className="h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
