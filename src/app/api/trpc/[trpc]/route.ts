import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { env } from "#/env/server.mjs";
import { createTRPCFetchContext } from "#/server/api/context";
import { appRouter } from "#/server/api/root";

const trpcOnError =
  env.NODE_ENV === "development"
    ? ({
        path,
        error,
      }: {
        path: string | undefined;
        error: { message: string };
      }) => {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
        );
      }
    : undefined;

function handleTrpcRequest(request: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createTRPCFetchContext,
    onError: trpcOnError,
  });
}

export function GET(request: Request) {
  return handleTrpcRequest(request);
}

export function POST(request: Request) {
  return handleTrpcRequest(request);
}
