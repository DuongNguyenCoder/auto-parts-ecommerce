import type { NextRequest, NextResponse } from "next/server";
import { env } from "@/src/config/env.config";

export const ACCESS_TOKEN_COOKIE = "access_token";

const maxAgeInSeconds = 7 * 24 * 60 * 60;

export const getAccessTokenCookie = (request: NextRequest) =>
  request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;

export const setAccessTokenCookie = (
  response: NextResponse,
  accessToken: string,
) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeInSeconds,
  });

  return response;
};

export const clearAccessTokenCookie = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
};

export const authCookieRuntime = {
  secure: true,
  sameSite: "strict",
  httpOnly: true,
  isProduction: env.IS_PRODUCTION,
} as const;
