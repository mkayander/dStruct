// noinspection TypeScriptValidateJSTypes

import { Prisma, ProjectCategory, ProjectDifficulty } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import shortUUID from "short-uuid";
import { z } from "zod";

import defaultBinaryTreeTemplate from "#/assets/codeTemplates/binaryTreeTemplate.js.txt";
import defaultArrayTemplate from "#/assets/codeTemplates/arrayTemplate.js.txt";
import linkedListTemplate from "#/assets/codeTemplates/linkedListTemplate.js.txt";
import { protectedProcedure, publicProcedure, router } from "#/server/trpc/trpc";
import { type ArgumentObjectMap, argumentObjectValidator, ArgumentType } from "#/utils/argumentObject";
import { clearProjectEntities, getEntitySlug, getNextEntityIndex, setLastEntityIndex } from "#/utils";
import { type AppPrismaClient } from "#/server/db/client";

const uuid = shortUUID();

const templatesMap: Partial<Record<ProjectCategory, string>> = {
  [ProjectCategory.ARRAY]: defaultArrayTemplate,
  [ProjectCategory.BINARY_TREE]: defaultBinaryTreeTemplate,
  [ProjectCategory.LINKED_LIST]: linkedListTemplate
};

const getTemplate = (category: ProjectCategory): string => {
  return templatesMap[category] || defaultBinaryTreeTemplate;
};

const getDefaultArguments = (category: ProjectCategory): ArgumentObjectMap => {
  switch (category) {
    case ProjectCategory.ARRAY:
      return {
        array: {
          name: "array",
          order: 0,
          type: ArgumentType.ARRAY,
          input: "[1,2,3]"
        }
      };

    case ProjectCategory.BINARY_TREE:
      return {
        head: {
          name: "head",
          order: 0,
          type: ArgumentType.BINARY_TREE,
          input: "[1,2,3]"
        }
      };

    case ProjectCategory.LINKED_LIST:
      return {
        head: {
          name: "head",
          order: 0,
          type: ArgumentType.LINKED_LIST,
          input: "[1,2,3]"
        }
      };

    default:
      return {};
  }
};

const getCaseIndex = async (projectId: string, prisma: AppPrismaClient) => {
  let caseIndex = await getNextEntityIndex(projectId, "case");
  let caseSlug = getEntitySlug("case", caseIndex);
  let didSkip = false;

  while (await prisma.playgroundTestCase.findUnique({
    where: {
      projectId_slug: {
        projectId,
        slug: caseSlug
      }
    }
  })) {
    caseIndex++;
    caseSlug = getEntitySlug("case", caseIndex);
    didSkip = true;
  }

  if (didSkip) {
    void setLastEntityIndex(projectId, "case", caseIndex);
  }

  return { caseIndex, caseSlug };
};

const getSolutionIndex = async (projectId: string, prisma: AppPrismaClient) => {
  let solutionIndex = await getNextEntityIndex(projectId, "solution");
  let solutionSlug = getEntitySlug("solution", solutionIndex);
  let didSkip = false;

  while (await prisma.playgroundSolution.findUnique({
    where: {
      projectId_slug: {
        projectId,
        slug: solutionSlug
      }
    }
  })) {
    solutionIndex++;
    solutionSlug = getEntitySlug("solution", solutionIndex);
    didSkip = true;
  }

  if (didSkip) {
    void setLastEntityIndex(projectId, "solution", solutionIndex);
  }

  return { solutionIndex, solutionSlug };
};

const projectOwnerProcedure = protectedProcedure.use(async ({ ctx, rawInput, next }) => {
  const projectId: string | undefined = typeof rawInput === "object" && (<any>rawInput).projectId;
  if (!projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "Missing projectId" });

  const project = await ctx.prisma.playgroundProject.findUniqueOrThrow({
    where: {
      id: projectId
    }
  });

  const user = ctx.session.user;
  if (!user.isAdmin && project.userId !== user.id) {
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
        select: {
          id: true, createdAt: true, slug: true, title: true, category: true, difficulty: true, author: {
            select: {
              id: true,
              name: true,
              bucketImage: true
            }
          }
        },
        orderBy: [
          {
            category: "asc"
          },
          {
            title: "asc"
          }
        ]
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
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) =>
      ctx.prisma.playgroundProject.findUniqueOrThrow({
        where: {
          slug: input
        },
        include: {
          cases: {
            orderBy: {
              order: "asc"
            },
            select: {
              id: true,
              slug: true,
              order: true,
              title: true
            }
          },
          solutions: {
            orderBy: {
              order: "asc"
            },
            select: {
              id: true,
              slug: true,
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
        slug: z.ostring(),
        category: z.nativeEnum(ProjectCategory),
        difficulty: z.nativeEnum(ProjectDifficulty).optional(),
        description: z.ostring(),
        lcLink: z.ostring(),
        isPublic: z.boolean(),
        isExample: z.oboolean()
      })
    )
    .mutation(async ({ input: data, ctx }) =>
      ctx.prisma.playgroundProject.create({
        data: {
          ...data,
          userId: ctx.session.user.id,
          slug: data.slug || `project-${uuid.generate()}`,
          cases: {
            create: {
              title: "Case 1",
              slug: "case-1",
              order: 0,
              args: getDefaultArguments(data.category)
            }
          },
          solutions: {
            create: {
              title: "Solution 1",
              slug: "solution-1",
              order: 0,
              code: getTemplate(data.category)
            }
          }
        }
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
          console.log(e.message);
          console.log(e.cause);
          console.log(e.meta);
          console.log(e.name);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have a project with this name."
          });
        } else throw e;
      })
    ),

  update: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.ostring(),
        title: z.ostring(),
        category: z.nativeEnum(ProjectCategory).optional(),
        difficulty: z.nativeEnum(ProjectDifficulty).optional(),
        description: z.ostring(),
        lcLink: z.ostring(),
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
    .mutation(async ({ input: { projectId }, ctx }) => {
        void clearProjectEntities(projectId);
        return ctx.prisma.playgroundProject.delete({
          where: {
            id: projectId
          }
        });
      }
    ),

  // Delete all personal projects
  deleteAll: protectedProcedure.mutation(async ({ ctx }) =>
    ctx.prisma.playgroundProject.deleteMany({
      where: {
        userId: ctx.session.user.id
      }
    })
  ),

  getCaseBySlug: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.string()
      })
    )
    .query(async ({ input, ctx }) =>
      ctx.prisma.playgroundTestCase.findUniqueOrThrow({
        where: {
          projectId_slug: input
        }
      })
    ),

  addCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        referenceCaseSlug: z.ostring(),
        title: z.ostring(),
        order: z.number()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const args: ArgumentObjectMap = {};
      if (input.referenceCaseSlug) {
        const referenceCase = await ctx.prisma.playgroundTestCase.findUnique({
          where: {
            projectId_slug: {
              projectId: input.projectId,
              slug: input.referenceCaseSlug
            }
          }
        });
        referenceCase?.args && Object.assign(args, referenceCase.args);
      } else {
        const project = await ctx.prisma.playgroundProject.findUnique({
          where: {
            id: input.projectId
          }
        });

        if (project?.category === ProjectCategory.BINARY_TREE) {
          args["head"] = {
            name: "head",
            order: 0,
            type: ArgumentType.BINARY_TREE,
            input: "[]"
          };
        }
      }

      const { caseIndex, caseSlug } = await getCaseIndex(input.projectId, ctx.prisma);

      return ctx.prisma.playgroundTestCase.create({
        data: {
          projectId: ctx.project.id,
          title: input.title || `Case ${caseIndex}`,
          slug: caseSlug,
          order: input.order,
          args
        }
      });
    }),

  updateCase: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseId: z.string(),
        title: z.ostring(),
        slug: z.ostring(),
        args: z.record(argumentObjectValidator).optional(),
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

  reorderCases: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        caseIds: z.array(z.string())
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.$transaction(input.caseIds.map((id, index) =>
          ctx.prisma.playgroundTestCase.update({
            where: {
              id
            },
            data: {
              order: index + 1
            }
          })
        )
      )
    ),

  getSolutionBySlug: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        slug: z.string()
      })
    )
    .query(async ({ input, ctx }) =>
      ctx.prisma.playgroundSolution.findUniqueOrThrow({
        where: {
          projectId_slug: input
        }
      })
    ),

  addSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        referenceSolutionSlug: z.ostring(),
        title: z.ostring(),
        code: z.ostring(),
        order: z.onumber()
      })
    )
    .mutation(async ({ input, ctx }) => {
        const { referenceSolutionSlug, code, ...restData } = input;
        let content = code;
        if (referenceSolutionSlug) {
          const referenceSolution = await ctx.prisma.playgroundSolution.findUnique({
            where: {
              projectId_slug: {
                projectId: input.projectId,
                slug: referenceSolutionSlug
              }
            }
          });
          if (referenceSolution) {
            content = referenceSolution.code;
          }
        }

        const { solutionIndex, solutionSlug } = await getSolutionIndex(input.projectId, ctx.prisma);

        return ctx.prisma.playgroundSolution.create({
          data: {
            title: input.title || `Solution ${solutionIndex}`,
            code: content || getTemplate(ctx.project.category),
            slug: solutionSlug,
            ...restData
          }
        });
      }
    ),

  updateSolution: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionId: z.string(),
        title: z.ostring(),
        slug: z.ostring(),
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
    ),

  reorderSolutions: projectOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
        solutionIds: z.array(z.string())
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.$transaction(input.solutionIds.map((id, index) =>
          ctx.prisma.playgroundSolution.update({
            where: {
              id
            },
            data: {
              order: index + 1
            }
          })
        )
      )
    )
});
