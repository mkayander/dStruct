import { z } from 'zod';

import { publicProcedure, router } from '#/server/trpc/trpc';

export const leetcodeRouter = router({
  linkUser: publicProcedure
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
        where: { id: ctx.session?.user.id },
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

  unlinkUser: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session?.user.id },
      data: {
        leetCode: {
          delete: true,
        },
      },
    });
  }),
});
