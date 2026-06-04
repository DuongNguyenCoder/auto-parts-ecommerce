import { CarModel } from "@/types/car-model.type";
import { Prisma } from "../../prisma/generated/prisma";

export type Brand = {
  id: number;
  name: string;
  imageUrl: string | null;
  models?: CarModel[];
  slug: string | null;
};

// export const brandSelect = Prisma.validator<Prisma.BrandDefaultArgs>()({
//   select: {
//     id: true,
//     name: true,
//     slug: true,
//     imageUrl: true,
//     models: {
//       select: {
//         id: true,
//         name: true,
//         year: true,
//         slug: true,
//       },
//     },
//   },
// });

// export type Brand = Prisma.BrandGetPayload<typeof brandSelect>;
