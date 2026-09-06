import { cacheLife, cacheTag } from "next/cache";

import {
  calculateIsNew,
  getNewProjectMarginMs,
} from "#/entities/projectEntity/lib/calculateIsNew";
import { db } from "#/server/db/client";
import type { RouterOutputs } from "#/shared/api";

export const PUBLIC_PROJECTS_BRIEF_CACHE_TAG =
  "playground-public-projects-brief";

type PublicProjectsBrief = RouterOutputs["project"]["allBrief"];

async function queryPublicProjectsBrief(): Promise<PublicProjectsBrief> {
  const projects = await db.playgroundProject.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      createdAt: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
      author: {
        select: {
          id: true,
          name: true,
          bucketImage: true,
        },
      },
    },
    orderBy: [{ category: "asc" }, { title: "asc" }],
  });

  const newProjectMarginMs = await getNewProjectMarginMs();

  return projects.map((project) => ({
    ...project,
    isNew: calculateIsNew(project.createdAt, newProjectMarginMs),
  }));
}

/**
 * Cached anonymous project list for server redirects and prefetch.
 * Authenticated users still get personal projects via live tRPC `allBrief`.
 */
export async function loadCachedPublicProjectsBrief(): Promise<PublicProjectsBrief> {
  "use cache";
  cacheLife("hours");
  cacheTag(PUBLIC_PROJECTS_BRIEF_CACHE_TAG);

  return queryPublicProjectsBrief();
}
