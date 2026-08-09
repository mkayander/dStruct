import { i18nObject } from "typesafe-i18n";

import { initFormatters } from "#/i18n/formatters";
import type { Locales, TranslationFunctions } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

/** Server-only: typed translation functions for one locale (metadata, RSC). */
export async function loadLocaleTranslationFunctions(
  locale: Locales,
): Promise<TranslationFunctions> {
  const translation = await importLocaleAsync(locale);
  return i18nObject(locale, translation, initFormatters(locale));
}
