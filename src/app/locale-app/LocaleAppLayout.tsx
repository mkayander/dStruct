import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/server/auth/authOptions";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

/** Shared App Router locale layout for `app/[lang]`. */
export async function LocaleAppLayout({
  children,
  localeParam,
}: {
  children: React.ReactNode;
  localeParam: string;
}) {
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
