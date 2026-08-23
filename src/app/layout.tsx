import { Suspense } from "react";

import "#/shared/fonts/appFonts";
import {
  appDocumentMetadata,
  appDocumentViewport,
} from "#/shared/lib/appDocumentMetadata";

import { RootHtmlShell, RootHtmlShellFallback } from "#/app/RootHtmlShell";
import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

export { appDocumentMetadata as metadata, appDocumentViewport as viewport };

/**
 * Minimal root shell for App Router only. Locale for `<html lang>` comes from
 * {@link APP_ROUTER_LOCALE_HEADER} via {@link RootHtmlShell} (Suspense-split, L5).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<RootHtmlShellFallback>{children}</RootHtmlShellFallback>}
    >
      <RootHtmlShell>{children}</RootHtmlShell>
    </Suspense>
  );
}
