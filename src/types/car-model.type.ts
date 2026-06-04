import type { Brand } from "@/types/brand.type";

export type CarModel = {
  id: number;

  brandId: number;
  brand: Brand;

  imageUrl: string;

  slug: string | null;
  name: string;
  year: string | null;
};
