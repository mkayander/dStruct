import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/server/auth/authOptions";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

/** All pilot routes stay noindex even when a child page omits metadata. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Pilot routes are dynamic (daily data hooks + session); skip build-time SSG. */
export const dynamic = "force-dynamic";

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
