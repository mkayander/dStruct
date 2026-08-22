import type { Metadata } from "next";

import { locales } from "#/i18n/i18n-util";

import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

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
  return (
    <LocaleAppLayout localeParam={localeParam}>{children}</LocaleAppLayout>
  );
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}
