import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { postCategoryController } from "@/server/controllers/post-categories.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    await requireAdmin();
    return postCategoryController.update(request, await params);
  } catch (error) {
    return handleApiError(error);
  }
}
