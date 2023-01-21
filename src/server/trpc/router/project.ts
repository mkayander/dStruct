import { ProjectCategory } from '@prisma/client';
import { z } from 'zod';

import {
  protectedProcedure,
  publicProcedure,
  router,
} from '#/server/trpc/trpc';

export const projectRouter = router({
  // Select public and personal projects if authenticated
  all: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    return await ctx.prisma.playgroundProject.findMany({
      where: {
        OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }],
      },
    });
  }),

  allFiltered: publicProcedure
    .input(
      z.object({
        id: z.ostring(),
        title: z.ostring(),
        category: z.nativeEnum(ProjectCategory).optional(),
        input: z.ostring(),
        isPublic: z.oboolean(),
        isExample: z.oboolean(),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.prisma.playgroundProject.findMany({
        where: {
          AND: [
            input,
            { OR: [{ isPublic: true }, { userId: ctx.session?.user.id }] },
          ],
        },
      })
    ),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        category: z.nativeEnum(ProjectCategory),
        input: z.ostring(),
        isPublic: z.boolean(),
        isExample: z.oboolean(),
      })
    )
    .mutation(async ({ input: { input, ...data }, ctx }) =>
      ctx.prisma.playgroundProject.create({
        data: {
          input: input ?? '[]',
          ...data,
          userId: ctx.session.user.id,
        },
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.ostring(),
        category: z.nativeEnum(ProjectCategory).optional(),
        input: z.ostring(),
        isPublic: z.oboolean(),
        isExample: z.oboolean(),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundProject.update({
        where: {
          id: input.id,
        },
        data: input,
      })
    ),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundProject.delete({
        where: {
          id: input.id,
        },
      })
    ),

  // Delete all personal projects
  deleteAll: protectedProcedure.mutation(async ({ ctx }) =>
    ctx.prisma.playgroundProject.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
  ),

  addSolution: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        code: z.string(),
        order: z.onumber(),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundProject.update({
        where: {
          id: input.projectId,
        },
        data: {
          solutions: {
            create: input,
          },
        },
      })
    ),

  updateSolution: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
        title: z.ostring(),
        code: z.ostring(),
        order: z.onumber(),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.update({
        where: {
          id: input.solutionId,
        },
        data: input,
      })
    ),

  deleteSolution: protectedProcedure
    .input(
      z.object({
        solutionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.delete({
        where: {
          id: input.solutionId,
        },
      })
    ),
});

export type ProjectRouter = typeof projectRouter;
