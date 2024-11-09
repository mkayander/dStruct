import { useQuery } from "@tanstack/react-query";

import { type ConfigContextType } from "#/context/ConfigContext";

export const useAppConfig = () => {
  return useQuery<ConfigContextType>({
    queryKey: ["config"],
    queryFn: async () => fetch("/api/config").then((res) => res.json()),
  });
};
