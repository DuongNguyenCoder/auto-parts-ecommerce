import type { NextRequest } from "next/server";
import { authController } from "@/server/controllers/auth.controller";

export const runtime = "nodejs";

export const GET = (request: NextRequest) => authController.me(request);
