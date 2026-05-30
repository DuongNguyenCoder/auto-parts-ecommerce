import { requireAuth } from "@/lib/auth/guards";
import { ordersController } from "@/server/controllers/orders.controller";
import { handleApiError } from "@/server/http/api-response";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    return ordersController.getOrders(request, { userId: session.user.id });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    return ordersController.createOrder(request, { userId: session.user.id });
  } catch (error) {
    return handleApiError(error);
  }
}
