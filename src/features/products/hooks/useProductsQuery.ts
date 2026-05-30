import { useQuery } from "@tanstack/react-query";
import { productApi } from "@/features/products/api/product.api";
import { ProductListQuery } from "@/types";

export function useProductsQuery(
  filters: ProductListQuery,
  locked?: { categoryId?: number; carModelId?: number },
  // optional initial response (server-side fetched) to hydrate the client query
  initialData?: any,
) {
  const queryKey = ["products", filters, locked];

  return useQuery({
    queryKey,
    queryFn: () =>
      productApi.getAll({
        ...filters,
        ...locked,
      }),

    // hydrate with server response when available

    staleTime: 1000 * 60, // 1 min
  });
}
