import { requireAuth } from "@/lib/auth/guards";
import { consultationController } from "@/server/controllers/consultations.controller";
import { handleApiError } from "@/server/http/api-response";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return consultationController.list(request);
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    return consultationController.create(request);
  } catch (error) {
    return handleApiError(error);
  }
}
