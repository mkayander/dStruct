import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";
import { authOptions } from "#/server/auth/authOptions";
import { APP_ROUTER_SSR_DEVICE_TYPE_HEADER } from "#/shared/lib/appRouterLocaleHeader";
import { parseSsrDeviceTypeHeader } from "#/shared/lib/ssrDevice";
import type { SsrDeviceType } from "#/themes";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";
import { LocaleAppPageShell } from "#/app/locale-app/LocaleAppPageShell";
import { SessionGate } from "#/app/locale-app/streamingSession/SessionGate";

/** Shared App Router locale layout for `app/[lang]` and `(default-locale)`. */
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
  const [i18n, session] = await Promise.all([
    loadI18nForLocale(locale),
    getServerSession(authOptions),
  ]);

  const headerList = await headers();
  const ssrDeviceType: SsrDeviceType =
    parseSsrDeviceTypeHeader(
      headerList.get(APP_ROUTER_SSR_DEVICE_TYPE_HEADER),
    ) ?? "desktop";

  return (
    <AppRootLayoutClient
      i18n={i18n}
      locale={locale}
      ssrDeviceType={ssrDeviceType}
    >
      <SessionGate session={session}>
        <LocaleAppPageShell>{children}</LocaleAppPageShell>
      </SessionGate>
    </AppRootLayoutClient>
  );
}
