import { Prisma, ProjectCategory, ProjectDifficulty } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { argumentObjectValidator } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObjectMap } from "#/entities/argument/model/types";
import {
  clearProjectEntities,
  getEntitySlug,
  getNextEntityIndex,
  setLastEntityIndex,
} from "#/entities/projectEntity/lib";
import {
  getDefaultCodeSnippets,
  getMergedCodeContent,
} from "#/features/codeRunner/lib/getDefaultCodeSnippets";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "#/server/api/trpc";
import type { AppPrismaClient } from "#/server/db/client";
import { uuid } from "#/shared/lib";

const getDefaultArguments = (category: ProjectCategory): ArgumentObjectMap => {
  switch (category) {
    case ProjectCategory.ARRAY:
      return {
        array: {
          name: "array",
          order: 0,
          type: ArgumentType.ARRAY,
          input: "[1,2,3]",
        },
      };

    case ProjectCategory.BINARY_TREE:
      return {
        head: {
          name: "head",
          order: 0,
          type: ArgumentType.BINARY_TREE,
          input: "[1,2,3]",
        },
      };

    case ProjectCategory.LINKED_LIST:
      return {
        head: {
          name: "head",
          order: 0,
          type: ArgumentType.LINKED_LIST,
          input: "[1,2,3]",
        },
      };

    default:
      return {};
  }
};

const getCaseIndex = async (projectId: string, db: AppPrismaClient) => {
  let caseIndex = await getNextEntityIndex(projectId, "case");
  let caseSlug = getEntitySlug("case", caseIndex);
  let didSkip = false;

  while (
    await db.playgroundTestCase.findUnique({
      where: {
        projectId_slug: {
          projectId,
          slug: caseSlug,
        },
      },
    })
  ) {
    caseIndex++;
    caseSlug = getEntitySlug("case", caseIndex);
    didSkip = true;
  }

  if (didSkip) {
    void setLastEntityIndex(projectId, "case", caseIndex);
  }

  return { caseIndex, caseSlug };
};

const getSolutionIndex = async (projectId: string, db: AppPrismaClient) => {
  let solutionIndex = await getNextEntityIndex(projectId, "solution");
  let solutionSlug = getEntitySlug("solution", solutionIndex);
  let didSkip = false;

  while (
    await db.playgroundSolution.findUnique({
      where: {
        projectId_slug: {
          projectId,
          slug: solutionSlug,
        },
      },
    })
  ) {
    solutionIndex++;
    solutionSlug = getEntitySlug("solution", solutionIndex);
    didSkip = true;
  }

  if (didSkip) {
    void setLastEntityIndex(projectId, "solution", solutionIndex);
  }

  return { solutionIndex, solutionSlug };
};

const projectOwnerProcedure = protectedProcedure.use(
  async ({ ctx, next, getRawInput }) => {
    const input = await getRawInput();
    const projectId: string | undefined = (input as any)?.projectId;
    if (!projectId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing projectId",
      });

    const project = await ctx.db.playgroundProject.findUniqueOrThrow({
      where: {
        id: projectId,
      },
    });

    const user = ctx.session.user;
    if (!user.isAdmin && project.userId !== user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "You must be the owner of this project to perform this operation.",
      });
    }

    return next({
      ctx: {
        project,
      },
    });
  },
);

export const projectRouter = createTRPCRouter({
  // Select public and personal projects if authenticated
  all: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    return ctx.db.playgroundProject.findMany({
      where: {
        OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }],
      },
    });
  }),

  allBrief: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    const args = Prisma.validator<Prisma.PlaygroundProjectFindManyArgs>()({
      where: {
        OR: userId ? [{ isPublic: true }, { userId }] : [{ isPublic: true }],
      },
      select: {
        id: true,
        createdAt: true,
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        author: {
          select: {
            id: true,
            name: true,
            bucketImage: true,
          },
        },
      },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });

    return ctx.db.playgroundProject.findMany(args);
  }),

  allFiltered: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        category: z.nativeEnum(ProjectCategory).optional(),
        input: z.string().optional(),
        isPublic: z.boolean().optional(),
        isExample: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) =>
      ctx.db.playgroundProject.findMany({
        where: {
          AND: [
            input,
            { OR: [{ isPublic: true }, { userId: ctx.session?.user.id }] },
          ],
        },
      }),
    ),

  // Select a single project
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) =>
    ctx.db.playgroundProject
      .findUniqueOrThrow({
        where: {
          slug: input,
        },
        include: {
          cases: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              slug: true,
              order: true,
              title: true,
            },
          },
          solutions: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              slug: true,
              title: true,
              order: true,
            },
          },
        },
      })
      .catch((e: any) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Project "${input}" not found.`,
          });
        } else throw e;
      }),
  ),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string().optional(),
        category: z.nativeEnum(ProjectCategory),
        difficulty: z.nativeEnum(ProjectDifficulty).optional(),
        description: z.string().optional(),
        lcLink: z.string().optional(),
        isPublic: z.boolean(),
        isExample: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input: data, ctx }) =>
      ctx.db.playgroundProject
        .create({
          data: {
            ...data,
            userId: ctx.session.user.id,
            slug: data.slug || `project-${uuid.generate()}`,
            cases: {
              create: {
                title: "Case 1",
                slug: "case-1",
                order: 0,
                args: getDefaultArguments(data.category),
              },
            },
            solutions: {
              create: {
                title: "Solution 1",
                slug: "solution-1",
                order: 0,
                ...getDefaultCodeSnippets(data.category),
              },
            },
          },
        })
        .catch((e: any) => {
          if (
            e instanceof Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002"
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You already have a project with this name.",
            });
          } else throw e;
        }),
    ),

  update: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.string().optional(),
        title: z.string().optional(),
        category: z.nativeEnum(ProjectCategory).optional(),
        difficulty: z.nativeEnum(ProjectDifficulty).optional(),
        description: z.string().optional(),
        lcLink: z.string().optional(),
        isPublic: z.boolean().optional(),
        isExample: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input: { projectId: id, ...data }, ctx }) =>
      ctx.db.playgroundProject
        .update({
          where: {
            id,
          },
          data,
        })
        .catch((error: any) => {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You already have a project with this name.",
            });
          } else throw error;
        }),
    ),

  delete: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input: { projectId }, ctx }) => {
      void clearProjectEntities(projectId);
      return ctx.db.playgroundProject.delete({
        where: {
          id: projectId,
        },
      });
    }),

  // Delete all personal projects
  deleteAll: protectedProcedure.mutation(async ({ ctx }) =>
    ctx.db.playgroundProject.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    }),
  ),

  getCaseBySlug: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      ctx.db.playgroundTestCase.findUniqueOrThrow({
        where: {
          projectId_slug: input,
        },
      }),
    ),

  addCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        referenceCaseSlug: z.string().optional(),
        title: z.string().optional(),
        order: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const args: ArgumentObjectMap = {};
      if (input.referenceCaseSlug) {
        const referenceCase = await ctx.db.playgroundTestCase.findUnique({
          where: {
            projectId_slug: {
              projectId: input.projectId,
              slug: input.referenceCaseSlug,
            },
          },
        });
        if (referenceCase?.args) {
          Object.assign(args, referenceCase.args);
        }
      } else {
        const project = await ctx.db.playgroundProject.findUnique({
          where: {
            id: input.projectId,
          },
        });

        if (project?.category === ProjectCategory.BINARY_TREE) {
          args["head"] = {
            name: "head",
            order: 0,
            type: ArgumentType.BINARY_TREE,
            input: "[]",
          };
        }
      }

      const { caseIndex, caseSlug } = await getCaseIndex(
        input.projectId,
        ctx.db,
      );

      return ctx.db.playgroundTestCase.create({
        data: {
          projectId: ctx.project.id,
          title: input.title || `Case ${caseIndex}`,
          slug: caseSlug,
          order: input.order,
          args,
        },
      });
    }),

  updateCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseId: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        args: z.record(argumentObjectValidator).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input: { caseId, ...data }, ctx }) =>
      ctx.db.playgroundTestCase.update({
        where: { id: caseId },
        data,
      }),
    ),

  deleteCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseId: z.string(),
      }),
    )
    .mutation(async ({ input: { caseId }, ctx }) =>
      ctx.db.playgroundTestCase.delete({
        where: { id: caseId },
      }),
    ),

  reorderCases: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      ctx.db.$transaction(
        input.caseIds.map((id, index) =>
          ctx.db.playgroundTestCase.update({
            where: {
              id,
            },
            data: {
              order: index + 1,
            },
          }),
        ),
      ),
    ),

  getSolutionBySlug: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      ctx.db.playgroundSolution.findUniqueOrThrow({
        where: {
          projectId_slug: input,
        },
      }),
    ),

  addSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        referenceSolutionSlug: z.string().optional(),
        title: z.string().optional(),
        description: z.string().nullable().optional(),
        timeComplexity: z.string().nullable().optional(),
        spaceComplexity: z.string().nullable().optional(),
        code: z.string().nullable().optional(),
        pythonCode: z.string().nullable().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { referenceSolutionSlug, ...data } = input;
      if (referenceSolutionSlug) {
        const referenceSolution = await ctx.db.playgroundSolution.findUnique({
          where: {
            projectId_slug: {
              projectId: input.projectId,
              slug: referenceSolutionSlug,
            },
          },
        });
        if (referenceSolution) {
          data.code = referenceSolution.code;
          data.description = referenceSolution.description;
          data.timeComplexity = referenceSolution.timeComplexity;
          data.spaceComplexity = referenceSolution.spaceComplexity;
        }
      }

      const { solutionIndex, solutionSlug } = await getSolutionIndex(
        input.projectId,
        ctx.db,
      );

      return ctx.db.playgroundSolution.create({
        data: {
          title: input.title || `Solution ${solutionIndex}`,
          slug: solutionSlug,
          ...data,
          ...getMergedCodeContent(ctx.project.category, data),
        },
      });
    }),

  updateSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        timeComplexity: z.string().optional(),
        spaceComplexity: z.string().optional(),
        code: z.string().optional(),
        pythonCode: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ input: { solutionId, ...data }, ctx }) =>
      ctx.db.playgroundSolution.update({
        where: {
          id: solutionId,
        },
        data,
      }),
    ),

  deleteSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      ctx.db.playgroundSolution.delete({
        where: {
          id: input.solutionId,
        },
      }),
    ),

  reorderSolutions: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      ctx.db.$transaction(
        input.solutionIds.map((id, index) =>
          ctx.db.playgroundSolution.update({
            where: {
              id,
            },
            data: {
              order: index + 1,
            },
          }),
        ),
      ),
    ),
});
