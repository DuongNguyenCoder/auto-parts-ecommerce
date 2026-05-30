import { NextRequest } from "next/server";
import { postCategoryController } from "@/server/controllers/post-categories.controller";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return postCategoryController.getBySlug(request, await params);
}
