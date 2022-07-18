import { createRouter } from '../createRouter';
import { z } from 'zod';

export const userRouter = createRouter()
    // read all
    .query('all', {
        async resolve({ ctx }) {
            return ctx.prisma.user.findMany();
        },
    })
    .query('getById', {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ input: { id }, ctx }) {
            return ctx.prisma.user.findFirstOrThrow({
                where: { id },
            });
        },
    });
