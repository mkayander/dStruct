import { useRouter } from "next/router";
import { useMemo } from "react";

const BASE_PATH = "/playground";

export const usePlaygroundIds = () => {
  const router = useRouter();

  return useMemo(() => {
    const [projectId, caseId, solutionId] = Array.isArray(router.query.slug)
      ? router.query.slug
      : [];

    const setProject = (id: string) => router.push(`${BASE_PATH}/${id}`);
    const setCase = (id: string) => {
      if (!projectId) throw new Error("Project id must be set first");

      return router.push(`${BASE_PATH}/${projectId}/${id}/${solutionId ?? ""}`);
    };
    const setSolution = (id: string) => {
      if (!projectId || !caseId)
        throw new Error("Project and case ids must be set first");

      return router.push(`${BASE_PATH}/${projectId}/${caseId}/${id}`);
    };

    return {
      projectId,
      caseId,
      solutionId,
      setProject,
      setCase,
      setSolution,
    } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);
};
