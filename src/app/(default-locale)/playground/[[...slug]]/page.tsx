import type { Metadata } from "next";
import React, { Suspense } from "react";

import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import { baseLocale } from "#/i18n/i18n-util";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";

/** Playground — heavy client app; defer instant validation (L5). */
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug?.[0];
  const pagePath = slugStr ? `/playground/${slugStr}` : "/playground";
  const { pageTitle, pageDescription } = await resolvePlaygroundPageSeo(
    baseLocale,
    slugStr,
  );

  return publicAppMetadata({
    locale: baseLocale,
    pagePath,
    title: pageTitle,
    description: pageDescription,
  });
}

const PlaygroundFallback: React.FC = () => <SplitPanelsLayoutSkeleton />;

export default function DefaultLocalePlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundFallback />}>
      <PlaygroundPageView />
    </Suspense>
  );
}
