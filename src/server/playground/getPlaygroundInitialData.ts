import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";

import { createInnerTRPCContext } from "#/server/api/context";
import { createCaller } from "#/server/api/root";
import { authOptions } from "#/server/auth/authOptions";
import type { RouterOutputs } from "#/shared/api";

export type PlaygroundInitialData = {
  allBrief: RouterOutputs["project"]["allBrief"];
  projectBySlug: RouterOutputs["project"]["getBySlug"] | null;
  caseBySlug: RouterOutputs["project"]["getCaseBySlug"] | null;
  solutionBySlug: RouterOutputs["project"]["getSolutionBySlug"] | null;
};

export type ProjectBySlug = RouterOutputs["project"]["getBySlug"];

export async function loadProjectBySlug(
  caller: ReturnType<typeof createCaller>,
  projectSlug: string,
): Promise<ProjectBySlug | null> {
  try {
    return await caller.project.getBySlug(projectSlug);
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

async function loadSolutionBySlug(
  caller: ReturnType<typeof createCaller>,
  projectId: string,
  solutionSlug: string,
): Promise<RouterOutputs["project"]["getSolutionBySlug"] | null> {
  try {
    return await caller.project.getSolutionBySlug({
      projectId,
      slug: solutionSlug,
    });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

/**
 * Server-prefetch public playground lists and the active project/case/solution for RSC pages.
 * Hydrates client tRPC queries via {@link PlaygroundInitialDataProvider}.
 */
export async function getPlaygroundInitialData(
  projectSlug?: string,
  caseSlug?: string,
  solutionSlug?: string,
): Promise<PlaygroundInitialData> {
  const session = await getServerSession(authOptions);
  const caller = createCaller(
    await createInnerTRPCContext({
      session,
    }),
  );

  if (!projectSlug) {
    const allBrief = await caller.project.allBrief();
    return {
      allBrief,
      projectBySlug: null,
      caseBySlug: null,
      solutionBySlug: null,
    };
  }

  const [allBrief, projectBySlug] = await Promise.all([
    caller.project.allBrief(),
    loadProjectBySlug(caller, projectSlug),
  ]);

  if (!projectBySlug) {
    return {
      allBrief,
      projectBySlug: null,
      caseBySlug: null,
      solutionBySlug: null,
    };
  }

  if (!caseSlug) {
    return {
      allBrief,
      projectBySlug,
      caseBySlug: null,
      solutionBySlug: null,
    };
  }

  let caseBySlug: RouterOutputs["project"]["getCaseBySlug"] | null = null;

  try {
    caseBySlug = await caller.project.getCaseBySlug({
      projectId: projectBySlug.id,
      slug: caseSlug,
    });
  } catch (caseError) {
    if (caseError instanceof TRPCError && caseError.code === "NOT_FOUND") {
      caseBySlug = null;
    } else {
      throw caseError;
    }
  }

  if (!solutionSlug) {
    return { allBrief, projectBySlug, caseBySlug, solutionBySlug: null };
  }

  const solutionBySlug = await loadSolutionBySlug(
    caller,
    projectBySlug.id,
    solutionSlug,
  );

  return { allBrief, projectBySlug, caseBySlug, solutionBySlug };
}
