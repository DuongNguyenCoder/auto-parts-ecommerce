import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLOUDINARY_API_SECRET: z.string(),

  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  ACCESS_TOKEN_COOKIE: z.string().default("access_token"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsedEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  ACCESS_TOKEN_COOKIE: process.env.ACCESS_TOKEN_COOKIE,
  NODE_ENV: process.env.NODE_ENV,
});

export const envServer = {
  ...parsedEnv,
  IS_PRODUCTION: parsedEnv.NODE_ENV === "production",
};

export const getJwtAccessSecret = () => {
  if (envServer.JWT_ACCESS_SECRET) {
    return envServer.JWT_ACCESS_SECRET;
  }

  if (envServer.IS_PRODUCTION) {
    throw new Error("JWT_ACCESS_SECRET is required in production.");
  }

  return "development-only-auth-secret-change-before-production";
};
