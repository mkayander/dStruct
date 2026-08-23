import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/server/auth/authOptions";
import type { SsrDeviceType } from "#/themes";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

/** Shared App Router locale layout for `app/[lang]` and `(default-locale)`. */
export async function LocaleAppLayout({
  children,
  localeParam,
  ssrDeviceType,
}: {
  children: React.ReactNode;
  localeParam: string;
  ssrDeviceType?: SsrDeviceType;
}) {
  if (!locales.includes(localeParam as Locales)) {
    notFound();
  }
  const locale = localeParam as Locales;
  const session = await getServerSession(authOptions);
  const i18n = await loadI18nForLocale(locale);

  return (
    <AppRootLayoutClient
      session={session}
      i18n={i18n}
      locale={locale}
      ssrDeviceType={ssrDeviceType}
    >
      {children}
    </AppRootLayoutClient>
  );
}
