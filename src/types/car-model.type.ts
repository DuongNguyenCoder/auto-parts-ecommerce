import type { Brand } from "@/types/brand.type";

export type CarModel = {
  id: number;

  brandId: number;
  brand: Brand;

  name: string;
  year: string | undefined;
};
