import type { Metadata } from "next";
import React, { Suspense } from "react";

import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import { baseLocale } from "#/i18n/i18n-util";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";
import { resolveLangParam } from "#/app/locale-app/resolveLangParam";

/** Playground shell — instant with Suspense fallback skeleton (L5). */
export const instant = true;

const PlaygroundFallback: React.FC = () => <SplitPanelsLayoutSkeleton />;

export async function generateDefaultLocalePlaygroundMetadata({
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

export async function generateLangPlaygroundMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { slug, ...langParams } = await params;
  const locale = await resolveLangParam(
    Promise.resolve({ lang: langParams.lang }),
  );
  if (!locale) {
    return {};
  }
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

export function PlaygroundPage() {
  return (
    <Suspense fallback={<PlaygroundFallback />}>
      <PlaygroundPageView />
    </Suspense>
  );
}
