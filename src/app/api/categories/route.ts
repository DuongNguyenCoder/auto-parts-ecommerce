import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { categoryController } from "@/server/controllers/categories.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return categoryController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return categoryController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
