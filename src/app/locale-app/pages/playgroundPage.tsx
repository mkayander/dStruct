import type { Metadata } from "next";
import { connection } from "next/server";

import { PlaygroundInitialDataProvider } from "#/features/playground/context/PlaygroundInitialDataContext";
import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import { baseLocale } from "#/i18n/i18n-util";
import { getPlaygroundInitialData } from "#/server/playground/getPlaygroundInitialData";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";
import { resolveLangParamSync } from "#/app/locale-app/resolveLangParam";

/** Playground — instant shell; public data prefetched on server; fallback via loading.tsx. */
export const instant = true;

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
  const { lang: langParam, slug } = await params;
  const locale = resolveLangParamSync(langParam);
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

type PlaygroundPageProps = {
  params: Promise<{ slug?: string[]; lang?: string }>;
};

export async function PlaygroundPage({ params }: PlaygroundPageProps) {
  await connection();
  const { slug } = await params;
  const [projectSlug, caseSlug] = slug ?? [];
  const initialData = await getPlaygroundInitialData(projectSlug, caseSlug);

  return (
    <PlaygroundInitialDataProvider initialData={initialData}>
      <PlaygroundPageView />
    </PlaygroundInitialDataProvider>
  );
}
