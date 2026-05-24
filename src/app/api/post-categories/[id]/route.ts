import { postCategoryController } from "@/server/controllers/post-categories.controller";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return postCategoryController.getById(request, await params);
}
