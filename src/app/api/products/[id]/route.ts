import { productController } from "@/server/controllers/products.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return productController.getById(request, await params);
}
