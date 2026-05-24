import { requireAdmin, requireAuth } from "@/lib/auth/guards";
import { brandController } from "@/server/controllers/brands.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return brandController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await requireAdmin();
    return brandController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
