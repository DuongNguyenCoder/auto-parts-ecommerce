import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  JWT_ACCESS_SECRET: z.string().min(32).optional(),
  JWT_ACCESS_EXPIRES_IN: z.string().default("7d"),
  ACCESS_TOKEN_COOKIE: z.string().default("access_token"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

let cachedEnv: EnvServer | null = null;

type EnvServer = z.infer<typeof envSchema> & {
  IS_PRODUCTION: boolean;
};

export function getEnvServer(): EnvServer {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse(process.env);

  cachedEnv = {
    ...parsed,
    IS_PRODUCTION: parsed.NODE_ENV === "production",
  };

  return cachedEnv;
}

export const getJwtAccessSecret = () => {
  const env = getEnvServer();

  if (env.JWT_ACCESS_SECRET) {
    return env.JWT_ACCESS_SECRET;
  }

  if (env.IS_PRODUCTION) {
    throw new Error("JWT_ACCESS_SECRET is required in production.");
  }

  return "development-only-auth-secret-change-before-production";
};
