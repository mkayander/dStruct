import { describe, expect, it } from "vitest";

import { serverPrefetchMatchesRoute } from "#/features/playground/lib/serverPrefetchMatchesRoute";

describe("serverPrefetchMatchesRoute", () => {
  it("returns false when project prefetch is missing", () => {
    expect(serverPrefetchMatchesRoute(null, ["two-sum"])).toBe(false);
  });

  it("returns true when all prefetched slugs match the URL", () => {
    expect(
      serverPrefetchMatchesRoute(
        {
          projectBySlug: { slug: "two-sum" },
          caseBySlug: { slug: "case-1" },
          solutionBySlug: { slug: "solution-1" },
        },
        ["two-sum", "case-1", "solution-1"],
      ),
    ).toBe(true);
  });

  it("returns false when a slug segment differs", () => {
    expect(
      serverPrefetchMatchesRoute(
        {
          projectBySlug: { slug: "two-sum" },
          caseBySlug: { slug: "case-1" },
          solutionBySlug: null,
        },
        ["two-sum", "case-2"],
      ),
    ).toBe(false);
  });
});
