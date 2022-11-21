import { z } from 'zod';
import { router, publicProcedure } from '#/server/trpc/trpc';

export const leetcodeRouter = router({
    linkUser: publicProcedure
        .input(
            z.object({
                username: z.string(),
                userAvatar: z.string(),
            })
        )

        .mutation(async ({ input, ctx }) => {
            const { username, userAvatar } = input;
            return await ctx.prisma.user.update({
                where: { id: ctx.session?.user.id },
                data: {
                    leetCode: {
                        create: {
                            username,
                            userAvatar,
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
