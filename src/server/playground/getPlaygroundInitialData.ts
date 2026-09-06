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
};

type ProjectBySlug = RouterOutputs["project"]["getBySlug"];

async function loadProjectBySlug(
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

/**
 * Server-prefetch public playground lists and the active project/case for RSC pages.
 * Hydrates client tRPC queries via {@link PlaygroundInitialDataProvider}.
 */
export async function getPlaygroundInitialData(
  projectSlug?: string,
  caseSlug?: string,
): Promise<PlaygroundInitialData> {
  const session = await getServerSession(authOptions);
  const caller = createCaller(
    await createInnerTRPCContext({
      session,
    }),
  );

  if (!projectSlug) {
    const allBrief = await caller.project.allBrief();
    return { allBrief, projectBySlug: null, caseBySlug: null };
  }

  const [allBrief, projectBySlug] = await Promise.all([
    caller.project.allBrief(),
    loadProjectBySlug(caller, projectSlug),
  ]);

  if (!projectBySlug) {
    return { allBrief, projectBySlug: null, caseBySlug: null };
  }

  if (!caseSlug) {
    return { allBrief, projectBySlug, caseBySlug: null };
  }

  try {
    const caseBySlug = await caller.project.getCaseBySlug({
      projectId: projectBySlug.id,
      slug: caseSlug,
    });

    return { allBrief, projectBySlug, caseBySlug };
  } catch (caseError) {
    if (caseError instanceof TRPCError && caseError.code === "NOT_FOUND") {
      return { allBrief, projectBySlug, caseBySlug: null };
    }
    throw caseError;
  }
}
