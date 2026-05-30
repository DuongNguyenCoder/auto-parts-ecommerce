import { requireAuth } from "@/lib/auth/guards";
import { wishlistController } from "@/server/controllers/wishlist.controller";
import { handleApiError } from "@/server/http/api-response";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    return wishlistController.removeItem(request, {
      id: (await params).id,
      userId: session.user.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
