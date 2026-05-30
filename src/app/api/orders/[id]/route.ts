import { requireAuth } from "@/lib/auth/guards";
import { ordersController } from "@/server/controllers/orders.controller";
import { handleApiError } from "@/server/http/api-response";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    return ordersController.getOrder(request, {
      id,
      userId: session.user.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    return ordersController.updateOrder(request, { id });
  } catch (error) {
    return handleApiError(error);
  }
}
