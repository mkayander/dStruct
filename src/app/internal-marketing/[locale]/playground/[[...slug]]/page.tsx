import type { Metadata } from "next";
import React, { Suspense } from "react";

import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!locales.includes(localeParam as Locales)) {
    return { robots: { index: false, follow: false } };
  }
  const locale = localeParam as Locales;
  const slugStr = slug?.[0];
  const pagePath = slugStr ? `/playground/${slugStr}` : "/playground";
  const { pageTitle, pageDescription } = await resolvePlaygroundPageSeo(
    locale,
    slugStr,
  );

  return internalMarketingPilotMetadata({
    locale,
    pagePath,
    title: pageTitle,
    description: pageDescription,
  });
}

const PlaygroundPilotFallback: React.FC = () => <SplitPanelsLayoutSkeleton />;

/** Instant Nav pilot: playground shell (noindex; public `/playground` remains canonical). */
export default function InternalMarketingPlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundPilotFallback />}>
      <PlaygroundPageView />
    </Suspense>
  );
}
