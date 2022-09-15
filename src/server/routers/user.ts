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
        input: z.ostring(),
        async resolve({ input: id, ctx }) {
            return ctx.prisma.user.findFirstOrThrow({
                where: { id },
            });
        },
    })
    .mutation('setBucketImage', {
        input: z.object({
            imageName: z.string(),
        }),
        async resolve({ input: { imageName }, ctx }) {
            return ctx.prisma.user.update({
                where: { id: ctx.session?.user.id },
                data: {
                    bucketImage: imageName,
                },
            });
        },
    });
