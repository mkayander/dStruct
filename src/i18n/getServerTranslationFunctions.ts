import { createTranslationFunctions } from "#/i18n/createTranslationFunctions";
import type { Locales, TranslationFunctions } from "#/i18n/i18n-types";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";

/** Server-side `LL` helpers for RSC pages (cached via `loadI18nForLocale`). */
export async function getServerTranslationFunctions(
  locale: Locales,
): Promise<TranslationFunctions> {
  const { translations } = await loadI18nForLocale(locale);
  const translation = translations[locale];
  if (!translation) {
    throw new Error(`Missing translations for locale: ${locale}`);
  }

  return createTranslationFunctions(locale, translation);
}
