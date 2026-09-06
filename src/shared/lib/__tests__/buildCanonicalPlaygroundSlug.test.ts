import { describe, expect, it } from "vitest";

import { buildCanonicalPlaygroundSlug } from "#/shared/lib/buildCanonicalPlaygroundSlug";

describe("buildCanonicalPlaygroundSlug", () => {
  const project = {
    slug: "two-sum",
    cases: [{ slug: "case-1" }, { slug: "case-2" }],
    solutions: [{ slug: "solution-1" }, { slug: "solution-2" }],
  };

  it("fills missing case and solution with first defaults", () => {
    expect(buildCanonicalPlaygroundSlug(project)).toEqual([
      "two-sum",
      "case-1",
      "solution-1",
    ]);
  });

  it("keeps a valid case slug and fills solution", () => {
    expect(buildCanonicalPlaygroundSlug(project, "case-2")).toEqual([
      "two-sum",
      "case-2",
      "solution-1",
    ]);
  });

  it("returns only project slug when there are no cases or solutions", () => {
    expect(
      buildCanonicalPlaygroundSlug({
        slug: "empty",
        cases: [],
        solutions: [],
      }),
    ).toEqual(["empty"]);
  });
});
