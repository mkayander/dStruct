import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockDbProjects } from "#/features/project/__tests__/mocks/projectMocks";
import { createInnerTRPCContext } from "#/server/api/context";
import { appRouter } from "#/server/api/root";
import type { PrismaClient } from "#/server/db/generated/client";
import {
  ProjectCategory,
  ProjectDifficulty,
} from "#/server/db/generated/client";

// Mock Prisma client using dependency injection pattern
// Create mock functions that will be used in tests
const mockFindMany = vi.fn();
const mockCount = vi.fn();

// Mock the db import - factory function must be self-contained
vi.mock("#/server/db/client", () => {
  const mockFindManyFn = vi.fn();
  const mockCountFn = vi.fn();

  return {
    db: {
      playgroundProject: {
        findMany: mockFindManyFn,
        count: mockCountFn,
      },
      user: {} as any,
      code: {} as any,
      leetcode: {} as any,
    },
    // Export mock functions so we can access them in tests
    __mockFindMany: mockFindManyFn,
    __mockCount: mockCountFn,
  };
});

const createMockDb = () =>
  ({
    playgroundProject: {
      findMany: mockFindMany,
      count: mockCount,
    },
    // Add other models as needed for type safety
    user: {} as any,
    code: {} as any,
    leetcode: {} as any,
  }) as unknown as PrismaClient;

const createMockContext = async (userId?: string) => {
  const ctx = await createInnerTRPCContext({
    session: userId
      ? ({
          user: { id: userId },
          expires: new Date().toISOString(),
        } as any)
      : null,
  });
  // Override db with mock
  ctx.db = createMockDb() as any;
  return ctx;
};

const caller = async (userId?: string) => {
  const ctx = await createMockContext(userId);
  return appRouter.createCaller(ctx);
};

describe("project.browseProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementations
    mockFindMany.mockReset();
    mockCount.mockReset();
  });

  describe("pagination", () => {
    it("should return first page with default pageSize", async () => {
      const mockProjects = createMockDbProjects(20);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(20);

      const result = await (
        await caller()
      ).project.browseProjects({
        page: 1,
        pageSize: 20,
      });

      expect(result.projects).toHaveLength(20);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.total).toBe(20);
      expect(result.hasMore).toBe(false);
    });

    it("should return correct page when hasMore is true", async () => {
      const mockProjects = createMockDbProjects(21); // One more than pageSize
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(21);

      const result = await (
        await caller()
      ).project.browseProjects({
        page: 1,
        pageSize: 20,
      });

      expect(result.projects).toHaveLength(20); // Should be sliced
      expect(result.hasMore).toBe(true);
    });

    it("should handle second page correctly", async () => {
      const mockProjects = createMockDbProjects(20);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(40);

      const result = await (
        await caller()
      ).project.browseProjects({
        page: 2,
        pageSize: 20,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (page - 1) * pageSize
          take: 21, // pageSize + 1
        }),
      );
      expect(result.page).toBe(2);
    });
  });

  describe("search", () => {
    it("should filter by search query", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        search: "test query",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                title: {
                  contains: "test query",
                  mode: "insensitive",
                },
              }),
            ]),
          }),
        }),
      );
    });

    it("should trim search query", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        search: "  test  ",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                title: {
                  contains: "test",
                  mode: "insensitive",
                },
              }),
            ]),
          }),
        }),
      );
    });

    it("should not add search filter when search is empty", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        search: "",
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];
      const hasSearchFilter = whereConditions.some(
        (condition: any) => condition.title,
      );

      expect(hasSearchFilter).toBe(false);
    });
  });

  describe("category filter", () => {
    it("should filter by categories", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        categories: [ProjectCategory.ARRAY, ProjectCategory.BINARY_TREE],
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                category: {
                  in: [ProjectCategory.ARRAY, ProjectCategory.BINARY_TREE],
                },
              }),
            ]),
          }),
        }),
      );
    });

    it("should not add category filter when categories array is empty", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        categories: [],
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];
      const hasCategoryFilter = whereConditions.some(
        (condition: any) => condition.category,
      );

      expect(hasCategoryFilter).toBe(false);
    });
  });

  describe("difficulty filter", () => {
    it("should filter by difficulties", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        difficulties: [ProjectDifficulty.EASY, ProjectDifficulty.MEDIUM],
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                difficulty: {
                  in: [ProjectDifficulty.EASY, ProjectDifficulty.MEDIUM],
                },
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe("showOnlyNew filter", () => {
    it("should filter by createdAt when showOnlyNew is true", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        showOnlyNew: true,
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];
      const hasDateFilter = whereConditions.some(
        (condition: any) => condition.createdAt?.gte,
      );

      expect(hasDateFilter).toBe(true);
    });

    it("should not add date filter when showOnlyNew is false", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        showOnlyNew: false,
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];
      const hasDateFilter = whereConditions.some(
        (condition: any) => condition.createdAt?.gte,
      );

      expect(hasDateFilter).toBe(false);
    });
  });

  describe("showOnlyMine filter", () => {
    it("should filter by userId when showOnlyMine is true and user is authenticated", async () => {
      const userId = "user-123";
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller(userId)
      ).project.browseProjects({
        showOnlyMine: true,
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                userId,
              }),
            ]),
          }),
        }),
      );
    });

    it("should not filter by userId when user is not authenticated", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await (
        await caller()
      ).project.browseProjects({
        showOnlyMine: true,
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];
      const hasUserIdFilter = whereConditions.some(
        (condition: any) => condition.userId,
      );

      expect(hasUserIdFilter).toBe(false);
    });
  });

  describe("sorting", () => {
    it("should sort by title ascending", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        sortBy: "title",
        sortOrder: "asc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ title: "asc" }],
        }),
      );
    });

    it("should sort by title descending", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        sortBy: "title",
        sortOrder: "desc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ title: "desc" }],
        }),
      );
    });

    it("should sort by difficulty with secondary sort by title", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        sortBy: "difficulty",
        sortOrder: "asc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ difficulty: "asc" }, { title: "asc" }],
        }),
      );
    });

    it("should sort by createdAt", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ createdAt: "desc" }],
        }),
      );
    });

    it("should sort by category with secondary sort by title", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        sortBy: "category",
        sortOrder: "asc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ category: "asc" }, { title: "asc" }],
        }),
      );
    });

    it("should default to category sort when sortBy is not provided", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (await caller()).project.browseProjects({});

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ category: "asc" }, { title: "asc" }],
        }),
      );
    });
  });

  describe("visibility filter", () => {
    it("should filter by isPublic when user is not authenticated", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (await caller()).project.browseProjects({});

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [{ isPublic: true }],
              }),
            ]),
          }),
        }),
      );
    });

    it("should filter by isPublic OR userId when user is authenticated", async () => {
      const userId = "user-123";
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (await caller(userId)).project.browseProjects({});

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: [{ isPublic: true }, { userId }],
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe("combined filters", () => {
    it("should combine search, category, and difficulty filters", async () => {
      const mockProjects = createMockDbProjects(5);
      mockFindMany.mockResolvedValue(mockProjects);
      mockCount.mockResolvedValue(5);

      await (
        await caller()
      ).project.browseProjects({
        search: "test",
        categories: [ProjectCategory.ARRAY],
        difficulties: [ProjectDifficulty.EASY],
      });

      const callArgs = mockFindMany.mock.calls[0]?.[0];
      const whereConditions = callArgs?.where?.AND || [];

      const hasSearch = whereConditions.some(
        (c: any) => c.title?.contains === "test",
      );
      const hasCategory = whereConditions.some((c: any) =>
        c.category?.in?.includes(ProjectCategory.ARRAY),
      );
      const hasDifficulty = whereConditions.some((c: any) =>
        c.difficulty?.in?.includes(ProjectDifficulty.EASY),
      );

      expect(hasSearch).toBe(true);
      expect(hasCategory).toBe(true);
      expect(hasDifficulty).toBe(true);
    });
  });
});
