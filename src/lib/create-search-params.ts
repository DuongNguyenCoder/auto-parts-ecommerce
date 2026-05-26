type QueryValue = string | number | boolean | undefined | null;

export const createSearchParams = (query?: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  if (!query) return params;

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === "number" && Number.isNaN(value))
    ) {
      params.set(key, String(value));
    }
  });

  return params;
};
