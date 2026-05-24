import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { handleApiError } from "@/server/http/api-response";
import { productController } from "@/server/controllers/products.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return productController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return productController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
