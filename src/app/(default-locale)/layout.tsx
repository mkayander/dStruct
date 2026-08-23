import { baseLocale } from "#/i18n/i18n-util";

import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale shell uses session/i18n loaders — opt out until cached (L5). */
export const instant = false;

/** Default-locale (`en`) public App shell at unprefixed URLs (L2). */
export default async function DefaultLocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LocaleAppLayout localeParam={baseLocale}>{children}</LocaleAppLayout>;
}
