import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { PlaygroundInitialDataProvider } from "#/features/playground/context/PlaygroundInitialDataContext";
import { resolvePlaygroundPageSeo } from "#/features/playground/lib/resolvePlaygroundPageSeo";
import { PlaygroundPageView } from "#/features/playground/ui/PlaygroundPageView";
import { baseLocale } from "#/i18n/i18n-util";
import { getPlaygroundInitialData } from "#/server/playground/getPlaygroundInitialData";
import { resolveCanonicalPlaygroundRedirect } from "#/server/playground/resolveCanonicalPlaygroundRedirect";
import { serializePlaygroundInitialData } from "#/server/playground/serializePlaygroundInitialData";
import { APP_ROUTER_SSR_DEVICE_TYPE_HEADER } from "#/shared/lib/appRouterLocaleHeader";
import { LAST_PLAYGROUND_PATH_COOKIE } from "#/shared/lib/playgroundLastPathCookie";
import { playgroundBasePathForLocale } from "#/shared/lib/playgroundRoute";
import { parseSsrDeviceTypeHeader } from "#/shared/lib/ssrDevice";

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
  searchParams: Promise<{ view?: string }>;
};

export async function PlaygroundPage({
  params,
  searchParams,
}: PlaygroundPageProps) {
  await connection();
  const { slug, lang: langParam } = await params;
  const { view: viewParam } = await searchParams;
  const locale = langParam
    ? (resolveLangParamSync(langParam) ?? baseLocale)
    : baseLocale;
  const basePath = playgroundBasePathForLocale(locale);
  const cookieStore = await cookies();
  const rawLastPathCookie =
    cookieStore.get(LAST_PLAYGROUND_PATH_COOKIE)?.value ?? null;
  const lastPathCookie = rawLastPathCookie
    ? decodeURIComponent(rawLastPathCookie)
    : null;

  const headerList = await headers();
  const ssrDeviceType =
    parseSsrDeviceTypeHeader(
      headerList.get(APP_ROUTER_SSR_DEVICE_TYPE_HEADER),
    ) ?? "desktop";

  const redirectPath = await resolveCanonicalPlaygroundRedirect({
    basePath,
    slug: slug ?? [],
    lastPathCookie,
    ssrDeviceType,
    viewParam,
  });

  if (redirectPath) {
    redirect(redirectPath);
  }

  const [projectSlug, caseSlug, solutionSlug] = slug ?? [];
  const initialData = serializePlaygroundInitialData(
    await getPlaygroundInitialData(projectSlug, caseSlug, solutionSlug),
  );

  return (
    <PlaygroundInitialDataProvider initialData={initialData}>
      <PlaygroundPageView />
    </PlaygroundInitialDataProvider>
  );
}
