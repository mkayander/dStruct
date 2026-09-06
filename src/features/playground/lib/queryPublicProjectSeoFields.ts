import { db } from "#/server/db/client";

export type PublicProjectSeoFields = {
  title: string;
  description: string | null;
};

/** Uncached DB read for public project SEO fields (wrapped by `loadPublicProjectSeoFields`). */
export async function queryPublicProjectSeoFields(
  slug: string,
): Promise<PublicProjectSeoFields | null> {
  return db.playgroundProject.findUnique({
    where: { slug, isPublic: true },
    select: { title: true, description: true },
  });
}
