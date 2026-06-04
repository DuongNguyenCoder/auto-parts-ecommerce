import { getEnvServer } from "@/config/env.server";
import { verifyAccessToken } from "@/server/auth/jwt";
import { AuthSession } from "@/types/auth";
import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const envServer = getEnvServer();

  const token = cookieStore.get(envServer.ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return null;
  }

  return {
    user: {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    },
  } satisfies AuthSession;
};
