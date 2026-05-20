import type { NextRequest } from "next/server";
import { authController } from "@/src/server/controllers/auth.controller";

export const runtime = "nodejs";

export const POST = (request: NextRequest) => authController.login(request);
