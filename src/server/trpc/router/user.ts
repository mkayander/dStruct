import { z } from "zod";

import {
  protectedProcedure,
  publicProcedure,
  router,
} from "#/server/trpc/trpc";

export const userRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),

  getById: publicProcedure
    .input(z.ostring())
    .query(async ({ input: id, ctx }) => {
      return ctx.prisma.user.findFirstOrThrow({
        where: { id },
      });
    }),

  setBucketImage: protectedProcedure
    .input(
      z.object({
        imageName: z.ostring(),
      })
    )
    .mutation(async ({ input: { imageName }, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          bucketImage: imageName ?? null,
        },
      });
    }),

  setDarkMode: protectedProcedure
    .input(z.boolean())
    .mutation(({ input, ctx }) =>
      ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          usesDarkMode: input,
        },
      })
    ),
});
