import { requireAuth } from "@/lib/auth/guards";
import { cartsController } from "@/server/controllers/carts.controller";
import { handleApiError } from "@/server/http/api-response";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    return cartsController.syncCart(request, { userId: session.user.id });
  } catch (error) {
    return handleApiError(error);
  }
}
