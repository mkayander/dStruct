/**
 * This file contains the root router of the tRPC-backend
 */
import { router, publicProcedure } from '#/server/trpc';
import { problemRouter } from '#/server/routers/problem';
import { leetcodeRouter } from '#/server/routers/leetcode';
import { userRouter } from '#/server/routers/user';

export const appRouter = router({
    health: publicProcedure.query(() => {
        return {
            text: `Hello world!`,
        };
    }),

    avatar: publicProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUniqueOrThrow({ where: { id: ctx.session?.user.id } });
        return user.image;
    }),

    user: userRouter,
    leetcode: leetcodeRouter,
    problem: problemRouter,
});

export type AppRouter = typeof appRouter;
