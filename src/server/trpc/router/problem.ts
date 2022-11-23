import { z } from 'zod';
import { publicProcedure, router } from '#/server/trpc/trpc';

export const problemRouter = router({
    all: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.problem.findMany();
    }),

    create: publicProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string(),
                checked: z.boolean(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, ...rest } = input;

            return await ctx.prisma.problem.update({
                where: { id },
                data: { ...rest },
            });
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.number(),
                title: z.string(),
                checked: z.boolean(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, ...rest } = input;

            return await ctx.prisma.problem.update({
                where: { id },
                data: { ...rest },
            });
        }),

    delete: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id } = input;

            return await ctx.prisma.problem.delete({ where: { id } });
        }),

    deleteAll: publicProcedure
        .input(
            z.object({
                ids: z.number().array(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { ids } = input;

            return await ctx.prisma.problem.deleteMany({
                where: {
                    id: { in: ids },
                },
            });
        }),
});

export type ProblemRouter = typeof problemRouter;
