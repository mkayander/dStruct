import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import React from "react";
import superjson from "superjson";

import { trpcReact } from "#/shared/lib/trpc";

const url = `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const trpcClient = trpcReact.createClient({
  links: [httpBatchLink({ url })],
  transformer: superjson,
});

export const withNextTRPC = ({ children }: React.PropsWithChildren) => (
  <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpcReact.Provider>
);
