import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";

export const userRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany();
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input: id, ctx }) => {
      return ctx.db.user.findFirstOrThrow({
        where: { id },
      });
    }),

  setBucketImage: protectedProcedure
    .input(
      z.object({
        imageName: z.string().optional(),
      }),
    )
    .mutation(async ({ input: { imageName }, ctx }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          bucketImage: imageName ?? null,
        },
      });
    }),

  setLightMode: protectedProcedure
    .input(z.boolean())
    .mutation(({ input, ctx }) =>
      ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          usesLightMode: input,
        },
      }),
    ),
});
