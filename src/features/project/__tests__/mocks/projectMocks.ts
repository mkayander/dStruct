import type {
  ProjectCategory,
  ProjectDifficulty,
} from "#/server/db/generated/enums";
import type { RouterOutputs } from "#/shared/api";

type ProjectBrief =
  RouterOutputs["project"]["browseProjects"]["projects"][number];

/** Prisma-like project shape (createdAt as Date) - for DB layer mocking */
type ProjectBriefFromDb = Omit<ProjectBrief, "createdAt"> & {
  createdAt: Date;
};

/**
 * Creates a mock project for API/component tests (createdAt as ISO string, matches API output)
 */
export const createMockProject = (
  overrides?: Partial<ProjectBrief>,
): ProjectBrief => {
  const now = new Date();
  const randomId = Math.random().toString(36).substring(7);

  return {
    id: `mock-project-${randomId}`,
    createdAt: new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(), // Random date within last 30 days
    slug: `mock-project-${randomId}`,
    title: `Mock Project ${randomId}`,
    category: "ARRAY" as ProjectCategory,
    difficulty: "EASY" as ProjectDifficulty,
    isNew: false,
    author: {
      id: `mock-author-${randomId}`,
      name: `Mock Author ${randomId}`,
      bucketImage: `https://example.com/avatar-${randomId}.jpg`,
    },
    ...overrides,
  };
};

/**
 * Creates an array of mock projects for API/component tests
 */
export const createMockProjects = (
  count: number,
  overrides?: Partial<ProjectBrief>[],
): ProjectBrief[] =>
  Array.from({ length: count }, (_, i) => createMockProject(overrides?.[i]));

/**
 * Creates mock projects for DB layer tests (createdAt as Date, simulates Prisma output)
 */
export const createMockDbProjects = (
  count: number,
  overrides?: Partial<ProjectBriefFromDb>[],
): ProjectBriefFromDb[] =>
  Array.from({ length: count }, (_, i) => {
    const now = new Date();
    const randomId = Math.random().toString(36).substring(7);
    return {
      id: `mock-project-${randomId}`,
      createdAt: new Date(
        now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ),
      slug: `mock-project-${randomId}`,
      title: `Mock Project ${randomId}`,
      category: "ARRAY" as ProjectCategory,
      difficulty: "EASY" as ProjectDifficulty,
      isNew: false,
      author: {
        id: `mock-author-${randomId}`,
        name: `Mock Author ${randomId}`,
        bucketImage: `https://example.com/avatar-${randomId}.jpg`,
      },
      ...overrides?.[i],
    };
  });

/**
 * Creates a mock browseProjects API response
 */
export const createMockBrowseResponse = (
  projects: ProjectBrief[],
  hasMore: boolean = false,
  page: number = 1,
  pageSize: number = 20,
): RouterOutputs["project"]["browseProjects"] => ({
  projects,
  total: projects.length,
  hasMore,
  page,
  pageSize,
});

/**
 * Creates mock projects with specific categories
 */
export const createMockProjectsByCategory = (
  category: ProjectCategory,
  count: number = 5,
): ProjectBrief[] => createMockProjects(count, Array(count).fill({ category }));

/**
 * Creates mock projects with specific difficulties
 */
export const createMockProjectsByDifficulty = (
  difficulty: ProjectDifficulty,
  count: number = 5,
): ProjectBrief[] =>
  createMockProjects(count, Array(count).fill({ difficulty }));

/**
 * Creates mock projects with specific titles (for search testing)
 */
export const createMockProjectsByTitle = (titles: string[]): ProjectBrief[] =>
  titles.map((title, index) =>
    createMockProject({
      title,
      slug: `mock-${title.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    }),
  );

/**
 * Creates mock projects sorted by date (newest first)
 */
export const createMockProjectsByDate = (
  _count: number,
  daysAgo: number[],
): ProjectBrief[] => {
  const now = new Date();
  return daysAgo.map((days, index) =>
    createMockProject({
      createdAt: new Date(
        now.getTime() - days * 24 * 60 * 60 * 1000,
      ).toISOString(),
      title: `Project ${index + 1}`,
    }),
  );
};
