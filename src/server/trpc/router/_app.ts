import { leetcodeRouter } from "#/server/trpc/router/leetcode";
import { problemRouter } from "#/server/trpc/router/problem";
import { projectRouter } from "#/server/trpc/router/project";
import { userRouter } from "#/server/trpc/router/user";

import { protectedProcedure, publicProcedure, router } from "../trpc";

export const appRouter = router({
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
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
