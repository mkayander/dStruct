import { protectedProcedure, publicProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { exampleRouter } from './example';
import { userRouter } from '#/server/trpc/router/user';
import { leetcodeRouter } from '#/server/trpc/router/leetcode';
import { problemRouter } from '#/server/trpc/router/problem';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,

  health: publicProcedure.query(() => {
    return {
      text: `Hello world!`,
    };
  }),

  avatar: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session?.user.id },
    });
    return user.image;
  }),

  user: userRouter,
  leetcode: leetcodeRouter,
  problem: problemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
