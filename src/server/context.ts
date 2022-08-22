// /* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingMessage } from 'http';
import ws from 'ws';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { getSession } from 'next-auth/react';
import prisma from '@src/server/prisma';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
    req,
    res,
}: trpcNext.CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
    const session = await getSession({ req });
    console.log('createContext for', session?.user?.name ?? 'unknown user');
    return {
        req,
        res,
        prisma,
        session,
    };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
