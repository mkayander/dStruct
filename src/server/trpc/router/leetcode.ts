import { z } from "zod";

import { protectedProcedure, router } from "#/server/trpc/trpc";

export const leetcodeRouter = router({
  linkUser: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        userAvatar: z.string(),
        token: z.string(),
      })
    )

    .mutation(async ({ input, ctx }) => {
      const { username, userAvatar, token } = input;
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          leetCode: {
            create: {
              username,
              userAvatar,
              token,
            },
          },
        },
      });
    }),

  unlinkUser: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        leetCode: {
          delete: true,
        },
      },
    });
  }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        leetCode: true,
      },
    });
    return user?.leetCode;
  }),
});
