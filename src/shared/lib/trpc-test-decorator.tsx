import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import React from "react";
import superjson from "superjson";

import { trpc } from "#/shared/api";

const url = `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url, transformer: superjson })],
});

export const withNextTRPC = ({ children }: React.PropsWithChildren) => (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpc.Provider>
);
