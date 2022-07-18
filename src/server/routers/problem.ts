import { createRouter } from '../createRouter';
import { z } from 'zod';

export const problemRouter = createRouter()
    // read
    .query('all', {
        async resolve({ ctx }) {
            return await ctx.prisma.problem.findMany();
        },
    })
    // create
    .mutation('create', {
        input: z.object({
            title: z.string(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.problem.create({
                data: { title: input.title },
            });
        },
    })
    // update
    .mutation('update', {
        input: z.object({
            id: z.number(),
            title: z.string(),
            checked: z.boolean(),
        }),
        async resolve({ input, ctx }) {
            const { id, ...rest } = input;

            return await ctx.prisma.problem.update({
                where: { id },
                data: { ...rest },
            });
        },
    })
    // delete
    .mutation('delete', {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input, ctx }) {
            const { id } = input;

            return await ctx.prisma.problem.delete({ where: { id } });
        },
    })
    // delete all
    .mutation('deleteAll', {
        input: z.object({
            ids: z.number().array(),
        }),
        async resolve({ input, ctx }) {
            const { ids } = input;

            return await ctx.prisma.problem.deleteMany({
                where: {
                    id: { in: ids },
                },
            });
        },
    });

export type ProblemRouter = typeof problemRouter;
