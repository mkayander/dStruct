import { cacheLife, cacheTag } from "next/cache";

import {
  calculateIsNew,
  getNewProjectMarginMs,
} from "#/entities/projectEntity/lib/calculateIsNew";
import { PUBLIC_PROJECTS_BRIEF_CACHE_TAG } from "#/features/playground/lib/playgroundCacheTags";
import { db } from "#/server/db/client";
import type { RouterOutputs } from "#/shared/api";

export { PUBLIC_PROJECTS_BRIEF_CACHE_TAG };

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
    id: project.id,
    createdAt: project.createdAt,
    slug: project.slug,
    title: project.title,
    category: project.category,
    difficulty: project.difficulty,
    author: project.author
      ? {
          id: project.author.id,
          name: project.author.name,
          bucketImage: project.author.bucketImage,
        }
      : null,
    isNew: calculateIsNew(project.createdAt, newProjectMarginMs),
  }));
}

/**
 * Cached anonymous project list for server-only redirects (not client props).
 * `'use cache'` results must be plain objects — strip cache metadata before return.
 */
export async function loadCachedPublicProjectsBrief(): Promise<PublicProjectsBrief> {
  "use cache";
  cacheLife("hours");
  cacheTag(PUBLIC_PROJECTS_BRIEF_CACHE_TAG);

  const brief = await queryPublicProjectsBrief();
  return JSON.parse(JSON.stringify(brief)) as PublicProjectsBrief;
}
