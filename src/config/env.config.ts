import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsedEnv = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
});

export const env = {
  ...parsedEnv,
  IS_PRODUCTION: parsedEnv.NODE_ENV === "production",
};

export const getJwtAccessSecret = () => {
  if (env.JWT_ACCESS_SECRET) {
    return env.JWT_ACCESS_SECRET;
  }

  if (env.IS_PRODUCTION) {
    throw new Error("JWT_ACCESS_SECRET is required in production.");
  }

  return "development-only-auth-secret-change-before-production";
};
