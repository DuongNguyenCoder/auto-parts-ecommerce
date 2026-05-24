import type { BaseListQuery } from "@/types/query/query.type";

export type CarModelListQuery = BaseListQuery & {
  name?: string;

  year?: string;

  brandId?: number;
};
