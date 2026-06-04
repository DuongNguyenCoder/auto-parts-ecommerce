import type { CarModel } from "@/types";
import { CarModelProductListClient } from "./car-model-product-list-client";
import { productService } from "@/server/services/products.service";

type Props = {
  model: any;
};

export async function CarModelProductListServer({ model }: Props) {
  const productsRes = await productService.list(
    { carModelId: model.id },
    {
      take: 12,
      skip: 0,
    },
    {},
  );
  if (!productsRes.items) return null;

  return (
    <CarModelProductListClient
      model={model}
      initialResponse={productsRes}
      initialItems={productsRes.items}
    />
  );
}
