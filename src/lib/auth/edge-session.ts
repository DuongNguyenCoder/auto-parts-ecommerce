import type { NextRequest } from "next/server";
import { getEnvServer, getJwtAccessSecret } from "@/config/env.server";
import type { AuthSession } from "@/types/auth";

type EdgeJwtPayload = {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
  iat: number;
  exp: number;
};

const envServer = getEnvServer();

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const base64UrlDecode = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return textDecoder.decode(bytes);
};

const base64UrlEncode = (bytes: ArrayBuffer) => {
  const binary = String.fromCharCode(...new Uint8Array(bytes));

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
};

const isEdgeJwtPayload = (value: unknown): value is EdgeJwtPayload => {
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

const timingSafeStringEqual = (left: string, right: string) => {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
};

const sign = async (header: string, body: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getJwtAccessSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(`${header}.${body}`),
  );

  return base64UrlEncode(signature);
};

const verifyAccessTokenAtEdge = async (token: string) => {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = await sign(header, body);

  if (!timingSafeStringEqual(signature, expectedSignature)) {
    return null;
  }

  let payload: unknown;

  try {
    payload = JSON.parse(base64UrlDecode(body)) as unknown;
  } catch {
    return null;
  }

  if (
    !isEdgeJwtPayload(payload) ||
    payload.exp < Math.floor(Date.now() / 1000)
  ) {
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

export const getEdgeSession = async (request: NextRequest) => {
  const token = request.cookies.get(envServer.ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAccessTokenAtEdge(token);
};
