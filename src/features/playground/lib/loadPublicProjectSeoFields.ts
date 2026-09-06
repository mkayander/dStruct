import { cacheLife, cacheTag } from "next/cache";

import { playgroundProjectSeoCacheTag } from "#/features/playground/lib/playgroundProjectSeoCache";
import {
  type PublicProjectSeoFields,
  queryPublicProjectSeoFields,
} from "#/features/playground/lib/queryPublicProjectSeoFields";

export type { PublicProjectSeoFields };

/**
 * Cached public project fields for playground `<title>` / meta description.
 * Invalidated via {@link revalidatePlaygroundProjectSeo} on project mutations.
 */
export async function loadPublicProjectSeoFields(
  slug: string,
): Promise<PublicProjectSeoFields | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(playgroundProjectSeoCacheTag(slug));

  return queryPublicProjectSeoFields(slug);
}
