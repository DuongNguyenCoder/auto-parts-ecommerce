import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { carModelController } from "@/server/controllers/car-models.controller";
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
    return carModelController.delete(request, await params);
  } catch (error) {
    return handleApiError(error);
  }
}
