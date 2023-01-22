import { ProjectCategory } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  protectedProcedure,
  publicProcedure,
  router
} from '#/server/trpc/trpc';

import defaultJsTemplate from '#/codeTemplates/defaultTemplate.js.txt';

const projectOwnerProcedure = protectedProcedure.use(async ({ ctx, input, next }) => {
  const projectId: string | undefined = typeof input === 'object' && (<any>input).projectId;
  if (!projectId) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Missing projectId' });

  const project = await ctx.prisma.playgroundProject.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  if (project.userId !== ctx.session.user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message:
        'You must be the owner of this project to perform this operation.'
    });
  }

  return next({
    ctx: {
      project
    }
  });
});

export const projectRouter = router({
  // Select public and personal projects if authenticated
  all: publicProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user.id;
      return await ctx.prisma.playgroundProject.findMany({
        where: {
          OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }]
        }
      });
    }),

  allBrief: publicProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user.id;
      return await ctx.prisma.playgroundProject.findMany({
        where: {
          OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }]
        },
        select: { id: true, title: true, category: true }
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
        isExample: z.oboolean()
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.prisma.playgroundProject.findMany({
        where: {
          AND: [
            input,
            { OR: [{ isPublic: true }, { userId: ctx.session?.user.id }] }
          ]
        }
      })
    ),

  // Select a single project
  getById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) =>
      ctx.prisma.playgroundProject.findUniqueOrThrow({
        where: {
          id: input
        },
        include: {
          cases: true,
          solutions: true
        }
      })
    ),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        category: z.nativeEnum(ProjectCategory),
        description: z.ostring(),
        isPublic: z.boolean(),
        isExample: z.oboolean()
      })
    )
    .mutation(async ({ input: data, ctx }) =>
      ctx.prisma.playgroundProject.create({
        data: {
          ...data,
          userId: ctx.session.user.id,
          cases: {
            create: {
              title: 'Case 1',
              input: '[]'
            }
          },
          solutions: {
            create: {
              title: 'Solution 1',
              code: defaultJsTemplate
            }
          }
        }
      })
    ),

  update: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.ostring(),
        category: z.nativeEnum(ProjectCategory).optional(),
        input: z.ostring(),
        isPublic: z.oboolean(),
        isExample: z.oboolean()
      })
    )
    .mutation(async ({ input: { projectId: id, ...data }, ctx }) =>
      ctx.prisma.playgroundProject.update({
        where: {
          id
        },
        data
      })
    ),

  delete: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundProject.delete({
        where: {
          id: input.projectId
        }
      })
    ),

  // Delete all personal projects
  deleteAll: protectedProcedure.mutation(async ({ ctx }) =>
    ctx.prisma.playgroundProject.deleteMany({
      where: {
        userId: ctx.session.user.id
      }
    })
  ),

  addCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        input: z.string()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundTestCase.create({
        data: {
          projectId: ctx.project.id,
          title: input.title,
          input: input.input
        }
      })
    ),

  updateCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseId: z.string(),
        title: z.ostring(),
        input: z.ostring()
      })
    )
    .mutation(async ({ input: { caseId, ...data }, ctx }) =>
      ctx.prisma.playgroundTestCase.update({
        data,
        where: { id: caseId }
      })
    ),

  deleteCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseId: z.string()
      })
    )
    .mutation(async ({ input: { caseId }, ctx }) =>
      ctx.prisma.playgroundTestCase.delete({
        where: { id: caseId }
      })
    ),

  addSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        code: z.string(),
        order: z.onumber()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundProject.update({
        where: {
          id: input.projectId
        },
        data: {
          solutions: {
            create: input
          }
        }
      })
    ),

  updateSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string(),
        title: z.ostring(),
        code: z.ostring(),
        order: z.onumber()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.update({
        where: {
          id: input.solutionId
        },
        data: input
      })
    ),

  deleteSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.delete({
        where: {
          id: input.solutionId
        }
      })
    )
});

export type ProjectRouter = typeof projectRouter;
