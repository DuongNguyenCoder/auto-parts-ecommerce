import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { usersController } from "@/server/controllers/users.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return usersController.list(request);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return usersController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
