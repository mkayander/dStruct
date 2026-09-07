import { getServerSession } from "next-auth";

import type { PublicProjectSeoFields } from "#/features/playground/lib/loadPublicProjectSeoFields";
import { authOptions } from "#/server/auth/authOptions";
import { db } from "#/server/db/client";

/**
 * Uncached SEO lookup for private projects when the viewer is owner or admin.
 * Returns null for anonymous users and non-owners (no title leakage in `<meta>`).
 */
export async function loadProjectSeoFieldsForSession(
  slug: string,
): Promise<PublicProjectSeoFields | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  const project = await db.playgroundProject.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      isPublic: true,
      userId: true,
    },
  });

  if (!project) {
    return null;
  }

  if (project.isPublic) {
    return { title: project.title, description: project.description };
  }

  const isOwner = project.userId === userId;
  const isAdmin = Boolean(session.user.isAdmin);
  if (!isOwner && !isAdmin) {
    return null;
  }

  return { title: project.title, description: project.description };
}
