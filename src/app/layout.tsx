import { headers } from "next/headers";

import type { Locales } from "#/i18n/i18n-types";
import { getDocumentTextDirection } from "#/i18n/localeMeta";
import "#/shared/fonts/appFonts";
import { fontVariableClassNames } from "#/shared/fonts/appFonts";
import {
  appDocumentMetadata,
  appDocumentViewport,
  materialIconsStylesheetHref,
} from "#/shared/lib/appDocumentMetadata";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

export { appDocumentMetadata as metadata, appDocumentViewport as viewport };

/**
 * Minimal root shell for App Router only. Locale comes from {@link APP_ROUTER_LOCALE_HEADER}
 * (set in proxy for direct `/internal-marketing/[locale]` visits).
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
    <html lang={locale} dir={htmlDir} className={fontVariableClassNames}>
      <head>
        {/* Parity with `pages/_document.tsx` — Dark Reader must see this literal empty meta. */}
        <meta name="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={materialIconsStylesheetHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
