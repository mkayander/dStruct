import { createRouter } from '../createRouter';
import { z } from 'zod';

export const leetcodeRouter = createRouter()
    .mutation('linkUser', {
        input: z.object({
            username: z.string(),
            userAvatar: z.string(),
        }),
        async resolve({ input, ctx }) {
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
        },
    })
    .mutation('unlinkUser', {
        async resolve({ ctx }) {
            return await ctx.prisma.user.update({
                where: { id: ctx.session?.user.id },
                data: {
                    leetCode: {
                        delete: true,
                    },
                },
            });
        },
    });
