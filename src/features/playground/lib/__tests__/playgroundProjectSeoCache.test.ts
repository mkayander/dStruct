import { describe, expect, it, vi } from "vitest";

const mockRevalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}));

describe("playgroundProjectSeoCache", () => {
  it("revalidates public list when a public project changes", async () => {
    const { revalidatePublicPlaygroundProject } =
      await import("#/features/playground/lib/playgroundProjectSeoCache");

    revalidatePublicPlaygroundProject("two-sum");

    expect(mockRevalidateTag).toHaveBeenCalledWith(
      "playground-project-seo:two-sum",
      "hours",
    );
    expect(mockRevalidateTag).toHaveBeenCalledWith(
      "playground-public-projects-brief",
      "hours",
    );
  });
});
