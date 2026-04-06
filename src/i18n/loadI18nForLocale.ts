import { type I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

/**
 * Server-only: load one locale bundle for App Router RSC props (e.g. root layout).
 */
export async function loadI18nForLocale(
  locale: Locales,
): Promise<I18nProps> {
  const translations = { [locale]: await importLocaleAsync(locale) };
  return { translations };
}
