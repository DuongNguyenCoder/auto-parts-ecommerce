import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { usersController } from "@/server/controllers/users.controller";
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
    return usersController.delete(request, await params);
  } catch (error) {
    return handleApiError(error);
  }
}
