import { getServerSession } from "next-auth";

import { createInnerTRPCContext } from "#/server/api/context";
import { createCaller } from "#/server/api/root";
import { authOptions } from "#/server/auth/authOptions";
import type { RouterOutputs } from "#/shared/api";
import {
  buildCanonicalPlaygroundSlug,
  playgroundSlugKey,
} from "#/shared/lib/buildCanonicalPlaygroundSlug";
import { getRestorablePlaygroundPath } from "#/shared/lib/playgroundLastPath";
import {
  buildPlaygroundPath,
  parsePlaygroundPathname,
} from "#/shared/lib/playgroundRoute";

import { loadProjectBySlug } from "./getPlaygroundInitialData";

type ProjectBySlug = RouterOutputs["project"]["getBySlug"];

async function createPlaygroundCaller() {
  const session = await getServerSession(authOptions);
  return createCaller(
    await createInnerTRPCContext({
      session,
    }),
  );
}

async function resolveProjectSlug(
  caller: ReturnType<typeof createCaller>,
  slug: string[],
  lastPathCookie: string | null,
  basePath: string,
): Promise<ProjectBySlug | null> {
  const [projectSlug] = slug;

  if (projectSlug) {
    const project = await loadProjectBySlug(caller, projectSlug);
    if (project) {
      return project;
    }
  }

  const restoredPath = getRestorablePlaygroundPath(lastPathCookie, basePath);
  const restoredParsed = restoredPath
    ? parsePlaygroundPathname(restoredPath)
    : null;
  const restoredProjectSlug = restoredParsed?.slug[0];

  if (restoredProjectSlug) {
    const restoredProject = await loadProjectBySlug(
      caller,
      restoredProjectSlug,
    );
    if (restoredProject) {
      return restoredProject;
    }
  }

  const allBrief = await caller.project.allBrief();
  const firstProjectSlug = allBrief[0]?.slug;
  if (!firstProjectSlug) {
    return null;
  }

  return loadProjectBySlug(caller, firstProjectSlug);
}

export type ResolveCanonicalPlaygroundRedirectInput = {
  basePath: string;
  slug: string[];
  lastPathCookie: string | null;
};

/**
 * Returns a canonical playground pathname when URL segments are incomplete,
 * or null when the current path already matches the canonical slug.
 */
export async function resolveCanonicalPlaygroundRedirect({
  basePath,
  slug,
  lastPathCookie,
}: ResolveCanonicalPlaygroundRedirectInput): Promise<string | null> {
  const caller = await createPlaygroundCaller();
  const project = await resolveProjectSlug(
    caller,
    slug,
    lastPathCookie,
    basePath,
  );

  if (!project) {
    return null;
  }

  const restoredPath = getRestorablePlaygroundPath(lastPathCookie, basePath);
  const restoredParsed = restoredPath
    ? parsePlaygroundPathname(restoredPath)
    : null;
  const useRestoredSegments =
    !slug[0] && restoredParsed?.slug[0] === project.slug;

  const [, caseSlug = "", solutionSlug = ""] = slug;
  const canonicalSlug = buildCanonicalPlaygroundSlug(
    project,
    useRestoredSegments ? (restoredParsed?.slug[1] ?? caseSlug) : caseSlug,
    useRestoredSegments
      ? (restoredParsed?.slug[2] ?? solutionSlug)
      : solutionSlug,
  );

  const currentSlugKey = playgroundSlugKey(slug);
  const canonicalSlugKey = playgroundSlugKey(canonicalSlug);

  if (currentSlugKey === canonicalSlugKey) {
    return null;
  }

  return buildPlaygroundPath(basePath, canonicalSlug);
}
