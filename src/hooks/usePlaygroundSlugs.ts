import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

const BASE_PATH = "/playground";

export const usePlaygroundSlugs = () => {
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.asPath;
    const projectSlug = currentPath.split("/")[2];
    if (!projectSlug) return;

    localStorage.setItem("lastPlaygroundPath", currentPath);
  }, [router.asPath]);

  return useMemo(() => {
    const [projectSlug, caseSlug, solutionSlug] = Array.isArray(
      router.query.slug
    )
      ? router.query.slug
      : [];

    const setProject = (slug: string, isInitial?: boolean) => {
      const lastPath = localStorage.getItem("lastPlaygroundPath");
      const lastProjectSlug = lastPath?.split("/")[2];

      if (lastProjectSlug && isInitial && !lastProjectSlug.startsWith("[[")) {
        return router.replace(lastPath);
      }

      return router.replace(`${BASE_PATH}/${slug}`);
    };
    const setCase = (slug: string) => {
      if (!projectSlug) throw new Error("Project id must be set first");

      if (!slug) return setProject(projectSlug);

      return router[caseSlug ? "push" : "replace"](
        `${BASE_PATH}/${projectSlug}/${slug}/${solutionSlug ?? ""}`
      );
    };
    const setSolution = (slug: string) => {
      if (!projectSlug || !caseSlug)
        throw new Error("Project and case ids must be set first");

      return router[solutionSlug ? "push" : "replace"](
        `${BASE_PATH}/${projectSlug}/${caseSlug}/${slug}`
      );
    };

    const clearSlugs = () => {
      return router.push(BASE_PATH);
    };

    return {
      projectSlug,
      caseSlug,
      solutionSlug,
      setProject,
      setCase,
      setSolution,
      clearSlugs,
    } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);
};
