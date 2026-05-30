import type { CarModel } from "@/types";
import { productApi } from "@/features/products/api/product.api";
import { CarModelProductListClient } from "./car-model-product-list-client";

type Props = {
  model: CarModel;
};

export async function CarModelProductListServer({ model }: Props) {
  const productsRes = await productApi.getAll({
    carModelId: model.id,
    take: 12,
    skip: 0,
  });

  if (!productsRes.success || !productsRes.data) return null;

  return (
    <CarModelProductListClient
      model={model}
      initialResponse={productsRes}
      initialItems={productsRes.data}
    />
  );
}
