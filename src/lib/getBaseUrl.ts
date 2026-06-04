import { getEnvClient } from "@/config/env.config";

export const getBaseUrl = () => {
  const envClient = getEnvClient();
  if (typeof window !== "undefined") {
    return "";
  }

  return envClient.NEXT_PUBLIC_APP_URL!;
};
