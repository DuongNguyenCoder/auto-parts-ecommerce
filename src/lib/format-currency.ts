type Currency = "VND" | "USD";

type Options = {
  currency?: Currency;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatCurrency(
  value: number | string | null | undefined,
  options: Options = {},
) {
  const {
    currency = "VND",
    locale = currency === "VND" ? "vi-VN" : "en-US",
    minimumFractionDigits = currency === "VND" ? 0 : 2,
    maximumFractionDigits = currency === "VND" ? 0 : 2,
  } = options;

  const amount = typeof value === "string" ? Number(value) : value;

  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}
