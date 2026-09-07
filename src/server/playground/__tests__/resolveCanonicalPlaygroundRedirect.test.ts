import { beforeEach, describe, expect, it, vi } from "vitest";

const mockAllBrief = vi.fn();
const mockGetBySlug = vi.fn();
const mockLoadCachedPublicProjectsBrief = vi.fn();

vi.mock("#/server/auth/authOptions", () => ({
  authOptions: {},
}));

vi.mock("#/server/api/root", () => ({
  createCaller: () => ({
    project: {
      allBrief: mockAllBrief,
      getBySlug: mockGetBySlug,
    },
  }),
}));

vi.mock("#/server/api/context", () => ({
  createInnerTRPCContext: async (opts: unknown) => opts,
}));

vi.mock("#/server/playground/loadCachedPublicProjectsBrief", () => ({
  loadCachedPublicProjectsBrief: () => mockLoadCachedPublicProjectsBrief(),
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue(null),
}));

describe("resolveCanonicalPlaygroundRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadCachedPublicProjectsBrief.mockResolvedValue([
      { id: "1", slug: "two-sum", title: "Two Sum" },
    ]);
    mockAllBrief.mockResolvedValue([
      { id: "1", slug: "two-sum", title: "Two Sum" },
    ]);
    mockGetBySlug.mockResolvedValue({
      id: "proj-1",
      slug: "two-sum",
      cases: [{ slug: "case-1" }],
      solutions: [{ slug: "solution-1" }],
    });
  });

  it("redirects bare /playground to the first public project when there is no last-visit cookie", async () => {
    const { resolveCanonicalPlaygroundRedirect } =
      await import("#/server/playground/resolveCanonicalPlaygroundRedirect");

    const redirectPath = await resolveCanonicalPlaygroundRedirect({
      basePath: "/playground",
      slug: [],
      lastPathCookie: null,
    });

    expect(redirectPath).toBe("/playground/two-sum/case-1/solution-1");
    expect(mockLoadCachedPublicProjectsBrief).toHaveBeenCalled();
  });

  it("keeps bare /playground when view=browse is set", async () => {
    const { resolveCanonicalPlaygroundRedirect } =
      await import("#/server/playground/resolveCanonicalPlaygroundRedirect");

    const redirectPath = await resolveCanonicalPlaygroundRedirect({
      basePath: "/playground",
      slug: [],
      lastPathCookie: null,
      viewParam: "browse",
    });

    expect(redirectPath).toBeNull();
    expect(mockLoadCachedPublicProjectsBrief).not.toHaveBeenCalled();
  });

  it("restores the last path from cookie when landing on bare /playground", async () => {
    mockGetBySlug.mockResolvedValue({
      id: "proj-2",
      slug: "three-sum",
      cases: [{ slug: "case-a" }],
      solutions: [{ slug: "solution-a" }],
    });

    const { resolveCanonicalPlaygroundRedirect } =
      await import("#/server/playground/resolveCanonicalPlaygroundRedirect");

    const redirectPath = await resolveCanonicalPlaygroundRedirect({
      basePath: "/playground",
      slug: [],
      lastPathCookie: "/playground/three-sum/case-a/solution-a",
    });

    expect(redirectPath).toBe("/playground/three-sum/case-a/solution-a");
  });

  it("returns null when the URL is already canonical", async () => {
    const { resolveCanonicalPlaygroundRedirect } =
      await import("#/server/playground/resolveCanonicalPlaygroundRedirect");

    const redirectPath = await resolveCanonicalPlaygroundRedirect({
      basePath: "/playground",
      slug: ["two-sum", "case-1", "solution-1"],
      lastPathCookie: null,
    });

    expect(redirectPath).toBeNull();
  });

  it("appends ?view=code on mobile when canonicalizing a project path", async () => {
    const { resolveCanonicalPlaygroundRedirect } =
      await import("#/server/playground/resolveCanonicalPlaygroundRedirect");

    const redirectPath = await resolveCanonicalPlaygroundRedirect({
      basePath: "/playground",
      slug: ["two-sum"],
      lastPathCookie: null,
      ssrDeviceType: "mobile",
    });

    expect(redirectPath).toBe(
      "/playground/two-sum/case-1/solution-1?view=code",
    );
  });
});
