import { SortOrder } from "@/types";

export const buildOrderBy = <TSortField extends string>(
  validFields: readonly TSortField[],
  sortBy?: TSortField,
  orderBy?: SortOrder,
): Record<string, SortOrder> => {
  if (sortBy && validFields.includes(sortBy)) {
    return {
      [sortBy]: orderBy ?? "desc",
    };
  }

  return {
    createdAt: "desc",
  };
};
