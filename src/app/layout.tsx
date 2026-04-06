import { headers } from "next/headers";

import type { Locales } from "#/i18n/i18n-types";
import { getDocumentTextDirection } from "#/i18n/localeMeta";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

/**
 * Minimal root shell for App Router only. Locale comes from {@link APP_ROUTER_LOCALE_HEADER}
 * (set in middleware for `/` rewrite and `/{locale}` marketing URLs).
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const locale = (headerList.get(APP_ROUTER_LOCALE_HEADER) ?? "en") as Locales;
  const htmlDir = getDocumentTextDirection(locale);

  return (
    <html lang={locale} dir={htmlDir}>
      <body>{children}</body>
    </html>
  );
}
