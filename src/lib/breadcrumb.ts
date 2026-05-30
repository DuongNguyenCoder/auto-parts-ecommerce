import { AppBreadcrumbItem } from "@/components/client/breadcrumbs";

const routeLabelMap: Record<string, string> = {
  "san-pham": "Sản phẩm",
  "hang-xe": "Hãng xe",
  "dong-xe": "Dòng xe",
};

const slugToLabel = (slug: string) => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function buildBreadcrumbsFromPath(
  pathname: string,
  currentLabel?: string,
): AppBreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: AppBreadcrumbItem[] = [{ label: "Trang chủ", href: "/" }];
  let accumulated = "";

  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const isLast = index === segments.length - 1;
    let label = routeLabelMap[segment] ?? slugToLabel(segment);

    if (isLast && currentLabel) {
      label = currentLabel;
    }

    items.push({
      label,
      href: isLast ? undefined : accumulated,
    });
  });

  return items;
}
