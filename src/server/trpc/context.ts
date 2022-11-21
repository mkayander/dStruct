import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '#/server/db/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
    const session = await getSession(opts);

    console.log('createContext for', session?.user?.name ?? 'unknown user');
    return {
        prisma,
        session,
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
