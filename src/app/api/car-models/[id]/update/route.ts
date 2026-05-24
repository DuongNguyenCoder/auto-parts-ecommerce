import { carModelController } from "@/server/controllers/car-models.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return carModelController.update(request, await params);
}
