"use client";

import { productApi } from "@/features/products/api/product.api";
import { Product } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Key = string;

interface Params {
  brandId: number;
  initialCarModelId: number;
  initialCategoryId: number;
}

export function useBrandProducts({
  brandId,
  initialCarModelId,
  initialCategoryId,
}: Params) {
  const [carModelId, setCarModelId] = useState(initialCarModelId);

  const [categoryId, setCategoryId] = useState(initialCategoryId);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const cacheRef = useRef(new Map<Key, Product[]>());

  const key = useMemo(
    () => `${brandId}-${carModelId}-${categoryId}`,
    [brandId, carModelId, categoryId],
  );

  const fetchProducts = useCallback(async () => {
    const cached = cacheRef.current.get(key);

    if (cached) {
      setProducts(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    const res = await productApi.getAll({
      brandId,
      carModelId,
      categoryId,
      take: 12,
    });

    const items = res.data ?? [];

    cacheRef.current.set(key, items);

    setProducts(items);
    setLoading(false);
  }, [key, brandId, carModelId, categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,

    carModelId,
    setCarModelId,

    categoryId,
    setCategoryId,
  };
}
