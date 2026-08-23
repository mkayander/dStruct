import { headers } from "next/headers";
import type { ReactNode } from "react";

import type { Locales } from "#/i18n/i18n-types";
import { getDocumentTextDirection } from "#/i18n/localeMeta";
import { fontVariableClassNames } from "#/shared/fonts/appFonts";
import { materialIconsStylesheetHref } from "#/shared/lib/appDocumentMetadata";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";

type RootHtmlShellProps = {
  children: ReactNode;
};

/** Reads proxy locale header for `<html lang>` / `dir` (request-time). */
export async function RootHtmlShell({ children }: RootHtmlShellProps) {
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
