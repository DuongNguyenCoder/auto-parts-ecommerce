import type { Category } from "@/types/category.type";
import type { CarModel } from "@/types/car-model.type";

export type Product = {
  id: number;

  slug: string;
  name: string;
  imageUrl?: string;

  price: number;

  categoryId: number;
  category: Category;

  fitments: CarModel[];

  createdAt: string;
  updatedAt: string;
};
