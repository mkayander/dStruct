type PlaygroundCaseBrief = {
  slug: string;
};

type PlaygroundSolutionBrief = {
  slug: string;
};

type PlaygroundProjectSlugSource = {
  slug: string;
  cases: PlaygroundCaseBrief[];
  solutions: PlaygroundSolutionBrief[];
};

const pickCaseSlug = (
  project: PlaygroundProjectSlugSource,
  caseSlug?: string,
): string | undefined => {
  if (
    caseSlug &&
    project.cases.some((testCase) => testCase.slug === caseSlug)
  ) {
    return caseSlug;
  }

  return project.cases[0]?.slug;
};

const pickSolutionSlug = (
  project: PlaygroundProjectSlugSource,
  solutionSlug?: string,
): string | undefined => {
  if (
    solutionSlug &&
    project.solutions.some((solution) => solution.slug === solutionSlug)
  ) {
    return solutionSlug;
  }

  return project.solutions[0]?.slug;
};

/**
 * Builds the canonical playground slug segments (project / case / solution)
 * by filling missing segments with the first available defaults.
 */
export const buildCanonicalPlaygroundSlug = (
  project: PlaygroundProjectSlugSource,
  caseSlug?: string,
  solutionSlug?: string,
): string[] => {
  const segments = [project.slug];

  const resolvedCaseSlug = pickCaseSlug(project, caseSlug);
  if (resolvedCaseSlug) {
    segments.push(resolvedCaseSlug);
  }

  const resolvedSolutionSlug = pickSolutionSlug(project, solutionSlug);
  if (resolvedSolutionSlug) {
    segments.push(resolvedSolutionSlug);
  }

  return segments;
};

export const playgroundSlugKey = (slug: string[]): string =>
  slug.filter((segment) => segment.length > 0).join("/");
