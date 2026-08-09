import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/pages/api/auth/[...nextauth]";
import {
  DEFAULT_SITE_DESCRIPTION,
  truncateMetaDescription,
} from "#/shared/lib/seo";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";
import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

const homeTitle = "dStruct — visualize LeetCode solutions";

/** Pilot routes are noindex; skip build-time SSG (daily page SSR can hang on data hooks). */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    return { title: homeTitle, robots: { index: false, follow: false } };
  }
  const locale = localeParam as Locales;

  return internalMarketingPilotMetadata({
    locale,
    pagePath: "/",
    title: homeTitle,
    description: truncateMetaDescription(DEFAULT_SITE_DESCRIPTION),
  });
}

export default async function InternalMarketingLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locales)) {
    notFound();
  }
  const locale = localeParam as Locales;
  const session = await getServerSession(authOptions);
  const i18n = await loadI18nForLocale(locale);

  return (
    <AppRootLayoutClient session={session} i18n={i18n} locale={locale}>
      {children}
    </AppRootLayoutClient>
  );
}
