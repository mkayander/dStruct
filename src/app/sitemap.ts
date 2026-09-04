import type { MetadataRoute } from "next";

import { db } from "#/server/db/client";
import { buildPublicSitemap } from "#/shared/lib/buildPublicSitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await db.playgroundProject.findMany({
    where: { isPublic: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  return buildPublicSitemap(projects);
}
