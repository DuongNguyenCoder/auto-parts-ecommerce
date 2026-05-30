import { CarModel } from "@/types/car-model.type";

export type Brand = {
  id: number;
  name: string;
  imageUrl: string;
  models?: CarModel[];
  slug: string;
};
