import "#/shared/fonts/appFonts";
import {
  appDocumentMetadata,
  appDocumentViewport,
} from "#/shared/lib/appDocumentMetadata";

import { RootHtmlShell } from "#/app/RootHtmlShell";
import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

export { appDocumentMetadata as metadata, appDocumentViewport as viewport };

/** Root reads request locale header — opts out of page-level instant validation (L5). */
export const instant = false;

/**
 * Minimal root shell for App Router only. Locale for `<html lang>` comes from
 * {@link APP_ROUTER_LOCALE_HEADER} (set in proxy for App Router locale paths).
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootHtmlShell>{children}</RootHtmlShell>;
}
