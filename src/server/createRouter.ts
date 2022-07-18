import { Context } from './context';
import * as trpc from '@trpc/server';

/**
 * Helper function to create a router with context
 */
export function createRouter() {
    return trpc.router<Context>().middleware(({ ctx, next }) => {
        if (!ctx.session) {
            console.warn('No session found');
            // throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
        }
        return next({
            ctx: {
                ...ctx,
                // infers that `session` is non-nullable to downstream resolvers
                session: ctx.session,
            },
        });
    });
}
