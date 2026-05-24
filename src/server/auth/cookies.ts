import type { NextRequest, NextResponse } from "next/server";
import { parseExpiresIn } from "./jwt";
import { envServer as env } from "@/config/env.server";

export const ACCESS_TOKEN_COOKIE = env.ACCESS_TOKEN_COOKIE;

const accessTokenMaxAge = parseExpiresIn(env.JWT_ACCESS_EXPIRES_IN);

export const getAccessTokenCookie = (request: NextRequest) =>
  request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;

export const setAccessTokenCookie = (
  response: NextResponse,
  accessToken: string,
) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: "strict",
    path: "/",
    maxAge: accessTokenMaxAge,
  });

  return response;
};

export const clearAccessTokenCookie = (response: NextResponse) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
};

export const authCookieRuntime = {
  secure: env.IS_PRODUCTION,
  sameSite: "strict",
  httpOnly: true,
  isProduction: env.IS_PRODUCTION,
} as const;
