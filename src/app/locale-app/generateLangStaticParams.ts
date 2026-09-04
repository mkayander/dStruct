import { baseLocale, locales } from "#/i18n/i18n-util";

/** Static `[lang]` segments for non-default locales (`en` uses `(default-locale)/`). */
export function generateLangStaticParams(): Array<{ lang: string }> {
  return locales
    .filter((locale) => locale !== baseLocale)
    .map((lang) => ({ lang }));
}
