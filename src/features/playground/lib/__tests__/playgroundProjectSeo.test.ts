import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindUnique = vi.fn();

vi.mock("#/server/db/client", () => ({
  db: {
    playgroundProject: {
      findUnique: mockFindUnique,
    },
  },
}));

describe("queryPublicProjectSeoFields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindUnique.mockResolvedValue({
      title: "Two Sum",
      description: "Find two numbers",
    });
  });

  it("queries only public projects by slug", async () => {
    const { queryPublicProjectSeoFields } =
      await import("#/features/playground/lib/queryPublicProjectSeoFields");
    const result = await queryPublicProjectSeoFields("two-sum");

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { slug: "two-sum", isPublic: true },
      select: { title: true, description: true },
    });
    expect(result?.title).toBe("Two Sum");
  });
});

describe("playgroundProjectSeoCacheTag", () => {
  it("builds a stable tag per slug", async () => {
    const { playgroundProjectSeoCacheTag } =
      await import("#/features/playground/lib/playgroundProjectSeoCache");
    expect(playgroundProjectSeoCacheTag("two-sum")).toBe(
      "playground-project-seo:two-sum",
    );
  });
});
