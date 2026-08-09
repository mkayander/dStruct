import { i18nObject as initI18nObject } from "typesafe-i18n";

import { initFormatters } from "#/i18n/formatters";
import type {
  Formatters,
  Locales,
  TranslationFunctions,
  Translations,
} from "#/i18n/i18n-types";

/** Server-side `LL` helpers from a loaded locale dictionary (no React provider). */
export function createTranslationFunctions(
  locale: Locales,
  translation: Translations,
): TranslationFunctions {
  return initI18nObject<
    Locales,
    Translations,
    TranslationFunctions,
    Formatters
  >(locale, translation, initFormatters(locale));
}
