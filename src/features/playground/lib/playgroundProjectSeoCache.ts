import { revalidateTag } from "next/cache";

import {
  playgroundProjectSeoCacheTag,
  PUBLIC_PROJECTS_BRIEF_CACHE_TAG,
} from "#/features/playground/lib/playgroundCacheTags";

export { playgroundProjectSeoCacheTag } from "#/features/playground/lib/playgroundCacheTags";

/** Bust cached public SEO fields after project create/update/delete. */
export function revalidatePlaygroundProjectSeo(slug: string): void {
  revalidateTag(playgroundProjectSeoCacheTag(slug), "hours");
}

/** Bust cached public project list used for server canonical redirects. */
export function revalidatePublicProjectsBrief(): void {
  revalidateTag(PUBLIC_PROJECTS_BRIEF_CACHE_TAG, "hours");
}

/** Revalidate SEO + public list when a public playground project changes. */
export function revalidatePublicPlaygroundProject(slug: string): void {
  revalidatePlaygroundProjectSeo(slug);
  revalidatePublicProjectsBrief();
}
