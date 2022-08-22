/**
 * This file contains the root router of the tRPC-backend
 */
import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { problemRouter } from '@src/server/routers/problem';
import { userRouter } from '@src/server/routers/user';
import * as trpc from '@trpc/server';

/**
 * Application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
    /**
     * Add data transformers
     * @link https://trpc.io/docs/data-transformers
     */
    .transformer(superjson)

    /**
     * Optionally do custom error (type safe!) formatting
     * @link https://trpc.io/docs/error-formatting
     */
    // .formatError(({ shape, error }) => { })

    /**
     * Add a health check endpoint to be called with `/api/trpc/healthz`
     */
    .query('healthz', {
        async resolve() {
            return 'yay!';
        },
    })

    /**
     * Merge sub routers
     */
    .merge('user.', userRouter)
    .merge('problem.', problemRouter)

    /**
     * Make all route below this middleware auth-only
     */
    .middleware(({ ctx, next }) => {
        if (!ctx.session) {
            throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
        }
        return next({
            ctx: {
                ...ctx,
                // infers that `session` is non-nullable to downstream resolvers
                session: ctx.session,
            },
        });
    })

    .query('avatar', {
        async resolve({ ctx }) {
            const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id: ctx.session.user.id } });
            return user.image;
        },
    });

export type AppRouter = typeof appRouter;
