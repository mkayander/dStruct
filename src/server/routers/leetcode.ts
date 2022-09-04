import { createRouter } from '../createRouter';
import { z } from 'zod';

export const leetcodeRouter = createRouter().mutation('linkUser', {
    input: z.object({
        username: z.string(),
        userAvatar: z.string(),
    }),
    async resolve({ input, ctx }) {
        const { username, userAvatar } = input;
        return await ctx.prisma.leetCodeUser.create({
            data: {
                username,
                userAvatar,
            },
        });
    },
});
