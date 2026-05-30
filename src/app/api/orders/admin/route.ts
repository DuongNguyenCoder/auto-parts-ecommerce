import { requireAuth } from "@/lib/auth/guards";
import { ordersController } from "@/server/controllers/orders.controller";
import { handleApiError } from "@/server/http/api-response";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    // TODO: Add role check for admin
    return ordersController.getAllOrders(request);
  } catch (error) {
    return handleApiError(error);
  }
}
