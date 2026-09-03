import { describe, expect, it } from "vitest";

import { buildPublicSitemap } from "#/shared/lib/buildPublicSitemap";
import { SITE_ORIGIN } from "#/shared/lib/seo";

describe("buildPublicSitemap", () => {
  it("includes static marketing and playground entry URLs", () => {
    const entries = buildPublicSitemap([]);

    expect(entries.map((entry) => entry.url)).toEqual([
      SITE_ORIGIN,
      `${SITE_ORIGIN}/daily`,
      `${SITE_ORIGIN}/playground`,
      `${SITE_ORIGIN}/privacy`,
    ]);
    expect(entries[0]?.priority).toBe(1);
    expect(entries[1]?.changeFrequency).toBe("daily");
  });

  it("maps public playground projects to playground URLs", () => {
    const entries = buildPublicSitemap([
      {
        slug: "invert-binary-tree",
        updatedAt: "2026-01-15T12:00:00.000Z",
      },
    ]);

    const projectEntry = entries.find((entry) =>
      entry.url.endsWith("/playground/invert-binary-tree"),
    );
    expect(projectEntry).toMatchObject({
      changeFrequency: "weekly",
      priority: 0.8,
    });
    expect(projectEntry?.lastModified).toEqual(
      new Date("2026-01-15T12:00:00.000Z"),
    );
  });
});
