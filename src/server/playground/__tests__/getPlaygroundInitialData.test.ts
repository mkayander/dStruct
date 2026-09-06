import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAllBrief = vi.fn();
const mockGetBySlug = vi.fn();
const mockGetCaseBySlug = vi.fn();
const mockGetSolutionBySlug = vi.fn();
const mockLoadCachedPublicProjectsBrief = vi.fn();

vi.mock("#/server/playground/loadCachedPublicProjectsBrief", () => ({
  loadCachedPublicProjectsBrief: () => mockLoadCachedPublicProjectsBrief(),
}));

vi.mock("#/server/auth/authOptions", () => ({
  authOptions: {},
}));

vi.mock("#/server/api/root", () => ({
  createCaller: () => ({
    project: {
      allBrief: mockAllBrief,
      getBySlug: mockGetBySlug,
      getCaseBySlug: mockGetCaseBySlug,
      getSolutionBySlug: mockGetSolutionBySlug,
    },
  }),
}));

vi.mock("#/server/api/context", () => ({
  createInnerTRPCContext: async (opts: unknown) => opts,
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

describe("getPlaygroundInitialData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadCachedPublicProjectsBrief.mockResolvedValue([
      { id: "1", slug: "demo", title: "Demo" },
    ]);
    mockAllBrief.mockResolvedValue([{ id: "1", slug: "demo", title: "Demo" }]);
    mockGetBySlug.mockResolvedValue({
      id: "proj-1",
      slug: "two-sum",
      title: "Two Sum",
    });
    mockGetCaseBySlug.mockResolvedValue({
      id: "case-1",
      slug: "case-a",
      projectId: "proj-1",
    });
    mockGetSolutionBySlug.mockResolvedValue({
      id: "solution-1",
      slug: "solution-a",
      projectId: "proj-1",
      code: "",
      pythonCode: "",
    });
  });

  it("returns allBrief only when no slug is provided", async () => {
    const { getPlaygroundInitialData } =
      await import("#/server/playground/getPlaygroundInitialData");
    const result = await getPlaygroundInitialData();

    expect(result.allBrief).toHaveLength(1);
    expect(result.projectBySlug).toBeNull();
    expect(result.caseBySlug).toBeNull();
    expect(result.solutionBySlug).toBeNull();
    expect(mockGetBySlug).not.toHaveBeenCalled();
  });

  it("prefetches project and case when slugs are provided", async () => {
    const { getPlaygroundInitialData } =
      await import("#/server/playground/getPlaygroundInitialData");
    const result = await getPlaygroundInitialData("two-sum", "case-a");

    expect(mockGetBySlug).toHaveBeenCalledWith("two-sum");
    expect(mockGetCaseBySlug).toHaveBeenCalledWith({
      projectId: "proj-1",
      slug: "case-a",
    });
    expect(result.projectBySlug?.slug).toBe("two-sum");
    expect(result.caseBySlug?.slug).toBe("case-a");
    expect(result.solutionBySlug).toBeNull();
  });

  it("prefetches solution when solution slug is provided", async () => {
    const { getPlaygroundInitialData } =
      await import("#/server/playground/getPlaygroundInitialData");
    const result = await getPlaygroundInitialData(
      "two-sum",
      "case-a",
      "solution-a",
    );

    expect(mockGetSolutionBySlug).toHaveBeenCalledWith({
      projectId: "proj-1",
      slug: "solution-a",
    });
    expect(result.solutionBySlug?.slug).toBe("solution-a");
  });

  it("keeps project prefetch when case slug is invalid", async () => {
    mockGetCaseBySlug.mockRejectedValue(
      new TRPCError({ code: "NOT_FOUND", message: "Case not found." }),
    );

    const { getPlaygroundInitialData } =
      await import("#/server/playground/getPlaygroundInitialData");
    const result = await getPlaygroundInitialData("two-sum", "missing-case");

    expect(result.projectBySlug?.slug).toBe("two-sum");
    expect(result.caseBySlug).toBeNull();
  });

  it("returns null project when project slug is invalid", async () => {
    mockGetBySlug.mockRejectedValue(
      new TRPCError({ code: "NOT_FOUND", message: "Project not found." }),
    );

    const { getPlaygroundInitialData } =
      await import("#/server/playground/getPlaygroundInitialData");
    const result = await getPlaygroundInitialData("missing-project");

    expect(result.allBrief).toHaveLength(1);
    expect(result.projectBySlug).toBeNull();
    expect(result.caseBySlug).toBeNull();
    expect(result.solutionBySlug).toBeNull();
  });
});
