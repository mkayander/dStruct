import { cacheLife, cacheTag } from "next/cache";

import { db } from "#/server/db/client";

export type PublicProjectSeoFields = {
  title: string;
  description: string | null;
};

/**
 * Cached public project fields for playground `<title>` / meta description.
 * Invalidated when admin edits ship `revalidateTag('playground-project-seo:*')`.
 */
export async function loadPublicProjectSeoFields(
  slug: string,
): Promise<PublicProjectSeoFields | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`playground-project-seo:${slug}`);

  return db.playgroundProject.findUnique({
    where: { slug, isPublic: true },
    select: { title: true, description: true },
  });
}
