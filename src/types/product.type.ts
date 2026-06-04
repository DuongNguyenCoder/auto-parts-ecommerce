import type { Category } from "@/types/category.type";
import type { CarModel } from "@/types/car-model.type";
import { Prisma } from "../../prisma/generated/prisma";
import { Serialized } from "@/server/utils/serialize";

// export type Product = {
//   id: number;

//   slug: string;
//   name: string;
//   imageUrl?: string;

//   price: number;

//   categoryId: number;
//   category: Category;

//   fitments: CarModel[];

//   createdAt: string;
//   updatedAt: string;
// };

export const productSelect = Prisma.validator<Prisma.ProductDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    name: true,
    imageUrl: true,
    price: true,
    categoryId: true,
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
      },
    },
    fitments: {
      select: {
        id: true,
        brandId: true,
        name: true,
        year: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  },
});

export type Product = Serialized<
  Prisma.ProductGetPayload<typeof productSelect>
>;
