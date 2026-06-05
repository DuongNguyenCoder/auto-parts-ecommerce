import { consultationController } from "@/server/controllers/consultations.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return consultationController.getById(request, await params);
}
