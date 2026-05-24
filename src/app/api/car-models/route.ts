import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { carModelController } from "@/server/controllers/car-models.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return carModelController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return carModelController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
