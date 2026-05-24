import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { postController } from "@/server/controllers/posts.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await requireAuth();
    await requireAdmin();
    return postController.update(request, await params);
  } catch (error) {
    return handleApiError(error);
  }
}
