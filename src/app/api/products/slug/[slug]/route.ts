import { productController } from "@/server/controllers/products.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return productController.getBySlug(request, await params);
}
