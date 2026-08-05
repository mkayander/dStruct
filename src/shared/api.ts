/**
 * tRPC React client: hooks (`api.*`) and {@link trpc.Provider} for App + Pages layouts.
 */
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { type AppRouter } from "#/server/api/root";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientConfig = () => ({
  links: [
    loggerLink({
      enabled: (opts) => {
        return (
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error)
        );
      },
    }),
    httpBatchLink({
      transformer: superjson,
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

/** Procedure hooks and `useUtils` — requires {@link trpc.Provider} + QueryClientProvider. */
export const api = trpc;

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
