import type { BaseListQuery } from "@/types/query/query.type";

export type BannerListQuery = BaseListQuery & {
  title?: string;

  isActive?: boolean;
};
