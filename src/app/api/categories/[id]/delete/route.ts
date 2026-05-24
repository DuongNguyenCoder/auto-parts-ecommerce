import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { categoryController } from "@/server/controllers/categories.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    await requireAdmin();
    return categoryController.delete(request, await params);
  } catch (error) {
    return handleApiError(error);
  }
}
