import type { MetadataRoute } from "next";

import { absoluteUrlFromPathname, SITE_ORIGIN } from "#/shared/lib/seo";

export type ProjectForSitemap = {
  slug: string;
  updatedAt: Date | string;
};

/** Parses DB/project timestamps into sitemap `lastModified` values. */
function toLastModified(updatedAt: Date | string): Date {
  return typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
}

/**
 * Public crawlable URLs for `/sitemap.xml` (home, marketing entry points, public playground projects).
 */
export function buildPublicSitemap(
  projects: ProjectForSitemap[],
): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE_ORIGIN,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrlFromPathname("/daily"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: absoluteUrlFromPathname("/playground"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrlFromPathname("/privacy"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = projects.map(
    ({ slug, updatedAt }) => ({
      url: absoluteUrlFromPathname(`/playground/${slug}`),
      lastModified: toLastModified(updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  return [...staticEntries, ...projectEntries];
}
