"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { trpc, trpcClientConfig } from "#/shared/api";

/**
 * tRPC + TanStack Query for both Pages Router (`_app`) and App Router (`app/layout`).
 * Mirrors the former `api.withTRPC` wrapper (ssr: false).
 */
export const TrpcProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  );
  const [trpcClient] = useState(() => trpc.createClient(trpcClientConfig()));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
