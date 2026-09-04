import type { Metadata } from "next";
import React, { Suspense } from "react";

import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";

/** Playground shell — instant with Suspense fallback skeleton (L5). */
export const instant = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang: langParam, slug } = await params;
  if (!locales.includes(langParam as Locales)) {
    return {};
  }
  const locale = langParam as Locales;
  const slugStr = slug?.[0];
  const pagePath = slugStr ? `/playground/${slugStr}` : "/playground";
  const { pageTitle, pageDescription } = await resolvePlaygroundPageSeo(
    locale,
    slugStr,
  );

  return publicAppMetadata({
    locale,
    pagePath,
    title: pageTitle,
    description: pageDescription,
  });
}

const PlaygroundFallback: React.FC = () => <SplitPanelsLayoutSkeleton />;

export default function LangPlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundFallback />}>
      <PlaygroundPageView />
    </Suspense>
  );
}
