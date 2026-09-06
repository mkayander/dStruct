type ServerPrefetchSlugData = {
  projectBySlug?: { slug: string } | null;
  caseBySlug?: { slug: string } | null;
  solutionBySlug?: { slug: string } | null;
};

/** True when server-prefetched playground data matches the active URL slug segments. */
export function serverPrefetchMatchesRoute(
  serverInitialData: ServerPrefetchSlugData | null,
  slug: string[],
): boolean {
  if (!serverInitialData?.projectBySlug) {
    return false;
  }

  const [projectSlug, caseSlug, solutionSlug] = slug;

  if (serverInitialData.projectBySlug.slug !== projectSlug) {
    return false;
  }

  if (caseSlug && serverInitialData.caseBySlug?.slug !== caseSlug) {
    return false;
  }

  if (solutionSlug && serverInitialData.solutionBySlug?.slug !== solutionSlug) {
    return false;
  }

  return true;
}
