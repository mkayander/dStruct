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

  const allBrief = await caller.project.allBrief();

  if (!projectSlug) {
    return { allBrief, projectBySlug: null, caseBySlug: null };
  }

  try {
    const projectBySlug = await caller.project.getBySlug(projectSlug);

    if (!caseSlug) {
      return { allBrief, projectBySlug, caseBySlug: null };
    }

    const caseBySlug = await caller.project.getCaseBySlug({
      projectId: projectBySlug.id,
      slug: caseSlug,
    });

    return { allBrief, projectBySlug, caseBySlug };
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      return { allBrief, projectBySlug: null, caseBySlug: null };
    }
    throw error;
  }
}
