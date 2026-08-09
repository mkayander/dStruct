import type { Locales } from "#/i18n/i18n-types";

/**
 * Public marketing home path for a locale (no trailing slash except `/` for `en`).
 * Static literals only — safe for navigation after {@link isLocale} validation.
 */
const LOCALE_BARE_HOME_PATH = {
  ar: "/ar",
  be: "/be",
  de: "/de",
  en: "/",
  es: "/es",
  fr: "/fr",
  hi: "/hi",
  id: "/id",
  it: "/it",
  ja: "/ja",
  ko: "/ko",
  nl: "/nl",
  pl: "/pl",
  pt: "/pt",
  ru: "/ru",
  sr: "/sr",
  tr: "/tr",
  uk: "/uk",
  vi: "/vi",
  zh: "/zh",
} as const satisfies Record<Locales, string>;

export function localeBareHomePath(locale: Locales): string {
  return LOCALE_BARE_HOME_PATH[locale];
}
