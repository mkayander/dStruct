import { codeRouter } from "#/server/api/routers/code";
import { leetcodeRouter } from "#/server/api/routers/leetcode";
import { projectRouter } from "#/server/api/routers/project";
import { userRouter } from "#/server/api/routers/user";
import {
  createCallerFactory,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return {
      text: `Hello world!`,
    };
  }),

  avatar: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUniqueOrThrow({
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

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
