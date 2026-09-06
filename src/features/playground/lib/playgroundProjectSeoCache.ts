import { revalidateTag } from "next/cache";

export const playgroundProjectSeoCacheTag = (slug: string) =>
  `playground-project-seo:${slug}`;

/** Bust cached public SEO fields after project create/update/delete. */
export function revalidatePlaygroundProjectSeo(slug: string): void {
  revalidateTag(playgroundProjectSeoCacheTag(slug), "hours");
}
