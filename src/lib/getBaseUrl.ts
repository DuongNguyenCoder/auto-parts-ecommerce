import { envClient } from "@/config/env.config";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }

  return envClient.NEXT_PUBLIC_APP_URL!;
};
