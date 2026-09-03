import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import { type Session } from "next-auth";

import { authOptions } from "#/server/auth/authOptions";

import { db } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for testing and `createCaller` without a Request. */
export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createInnerTRPCContext>>;

/** App Router fetch adapter — session from NextAuth via route cookies. */
export const createTRPCFetchContext = async (
  _opts: FetchCreateContextFnOptions,
): Promise<TRPCContext> => {
  const session = await getServerSession(authOptions);

  return createInnerTRPCContext({
    session,
  });
};
