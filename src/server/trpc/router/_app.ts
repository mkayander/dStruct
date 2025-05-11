import { codeRouter } from "#/server/trpc/router/code";
import { leetcodeRouter } from "#/server/trpc/router/leetcode";
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
  project: projectRouter,
  code: codeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
