import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),

  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().optional(),
});

let cachedEnv: EnvClient | null = null;
type EnvClient = z.infer<typeof envSchema>;

export function getEnvClient(): EnvClient {
  if (cachedEnv) {
    return cachedEnv;
  }
  const parsed = envSchema.parse(process.env);

  cachedEnv = {
    ...parsed,
  };

  return cachedEnv;
}
// const parsedEnv = envSchema.parse({
//   NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

//   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
//     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
// });

// export const envClient = {
//   ...parsedEnv,
// };
