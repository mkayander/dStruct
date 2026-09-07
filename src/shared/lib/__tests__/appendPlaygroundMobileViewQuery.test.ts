import { describe, expect, it } from "vitest";

import { appendPlaygroundMobileViewQuery } from "#/shared/lib/appendPlaygroundMobileViewQuery";

describe("appendPlaygroundMobileViewQuery", () => {
  it("appends ?view=code on mobile when canonicalizing without an existing view", () => {
    expect(
      appendPlaygroundMobileViewQuery("/playground/two-sum/case-1/solution-1", {
        isMobile: true,
        hasViewParam: false,
        hasCanonicalSlug: true,
      }),
    ).toBe("/playground/two-sum/case-1/solution-1?view=code");
  });

  it("leaves the path unchanged on desktop", () => {
    expect(
      appendPlaygroundMobileViewQuery("/playground/two-sum/case-1/solution-1", {
        isMobile: false,
        hasViewParam: false,
        hasCanonicalSlug: true,
      }),
    ).toBe("/playground/two-sum/case-1/solution-1");
  });

  it("does not append when a view param is already set", () => {
    expect(
      appendPlaygroundMobileViewQuery("/playground/two-sum/case-1/solution-1", {
        isMobile: true,
        hasViewParam: true,
        hasCanonicalSlug: true,
      }),
    ).toBe("/playground/two-sum/case-1/solution-1");
  });
});
