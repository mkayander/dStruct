import { ProjectCategory } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  protectedProcedure,
  publicProcedure,
  router
} from "#/server/trpc/trpc";

import defaultJsTemplate from "#/assets/codeTemplates/defaultTemplate.js.txt";
import shortUUID from "short-uuid";

const uuid = shortUUID();

const projectOwnerProcedure = protectedProcedure.use(async ({ ctx, rawInput, next }) => {
  const projectId: string | undefined = typeof rawInput === "object" && (<any>rawInput).projectId;
  if (!projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "Missing projectId" });

  const project = await ctx.prisma.playgroundProject.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  if (project.userId !== ctx.session.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "You must be the owner of this project to perform this operation."
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
      return ctx.prisma.playgroundProject.findMany({
        where: {
          OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }]
        }
      });
    }),

  allBrief: publicProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session?.user.id;
      return ctx.prisma.playgroundProject.findMany({
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
          cases: {
            select: {
              id: true,
              title: true
            }
          },
          solutions: {
            select: {
              id: true,
              title: true,
              order: true
            }
          }
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
          slug: `solution-${uuid.generate()}`,
          cases: {
            create: {
              title: "Case 1",
              slug: `case-${uuid.generate()}`,
              input: "[]"
            }
          },
          solutions: {
            create: {
              title: "Solution 1",
              slug: `solution-${uuid.generate()}`,
              code: defaultJsTemplate
            }
          }
        }
      }).catch((error) => {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have a project with this name."
          });
        } else throw error;
      })
    ),

  update: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.ostring(),
        category: z.nativeEnum(ProjectCategory).optional(),
        description: z.ostring(),
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
      }).catch((error) => {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have a project with this name."
          });
        } else throw error;
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

  getCaseById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string()
      })
    )
    .query(async ({ input, ctx }) =>
      ctx.prisma.playgroundTestCase.findUniqueOrThrow({
        where: {
          id: input.id
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
          slug: `case-${uuid.generate()}`,
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
        input: z.ostring(),
        description: z.ostring()
      })
    )
    .mutation(async ({ input: { caseId, ...data }, ctx }) =>
      ctx.prisma.playgroundTestCase.update({
        where: { id: caseId },
        data
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

  getSolutionById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        projectId: z.string()
      })
    )
    .query(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.findUniqueOrThrow({
        where: {
          id: input.id
        }
      })
    ),

  addSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        code: z.ostring(),
        order: z.onumber()
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.create({

        data: { code: defaultJsTemplate, slug: `solution-${uuid.generate()}`, ...input }
      })
    ),

  updateSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string(),
        title: z.ostring(),
        description: z.ostring(),
        code: z.ostring(),
        order: z.onumber()
      })
    )
    .mutation(async ({ input: { solutionId, ...data }, ctx }) =>
      ctx.prisma.playgroundSolution.update({
        where: {
          id: solutionId
        },
        data
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
