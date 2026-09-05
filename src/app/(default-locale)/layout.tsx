import { baseLocale } from "#/i18n/i18n-util";

import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale shell — cached i18n + synchronous SSR device hint; session streams via Suspense (P10). */
export const instant = false;

/** Default-locale (`en`) public App shell at unprefixed URLs (L2). */
export default async function DefaultLocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LocaleAppLayout localeParam={baseLocale}>{children}</LocaleAppLayout>;
}
