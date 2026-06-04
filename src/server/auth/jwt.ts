import { createHmac, timingSafeEqual } from "node:crypto";
import { getEnvServer, getJwtAccessSecret } from "@/config/env.server";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
};

type JwtPayload = AccessTokenPayload & {
  iat: number;
  exp: number;
};

const textEncoder = new TextEncoder();

const base64UrlEncode = (value: string | Buffer) =>
  Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

const base64UrlDecode = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
};

export const parseExpiresIn = (value: string) => {
  const match = /^(\d+)([smhd])$/.exec(value);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  } as const;

  return amount * multipliers[unit as keyof typeof multipliers];
};

const sign = (header: string, payload: string) =>
  base64UrlEncode(
    createHmac("sha256", getJwtAccessSecret())
      .update(`${header}.${payload}`)
      .digest(),
  );

export const signAccessToken = (payload: AccessTokenPayload) => {
  const env = getEnvServer();

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + parseExpiresIn(env.JWT_ACCESS_EXPIRES_IN),
    }),
  );
  const signature = sign(header, body);

  return `${header}.${body}.${signature}`;
};

const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sub === "string" &&
    typeof payload.email === "string" &&
    (payload.role === "USER" || payload.role === "ADMIN") &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number"
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = sign(header, body);
  const provided = textEncoder.encode(signature);
  const expected = textEncoder.encode(expectedSignature);

  if (
    provided.byteLength !== expected.byteLength ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  let payload: unknown;

  try {
    payload = JSON.parse(base64UrlDecode(body)) as unknown;
  } catch {
    return null;
  }

  if (!isJwtPayload(payload) || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  };
};
