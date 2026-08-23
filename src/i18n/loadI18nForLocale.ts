import { cacheLife } from "next/cache";

import { type I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

/**
 * Server-only: load one locale bundle for App Router RSC props (e.g. root layout).
 * Cached for Cache Components static shell (L5).
 */
export async function loadI18nForLocale(
  locale: Locales,
): Promise<I18nProps> {
  "use cache";
  cacheLife("max");

  const translations = { [locale]: await importLocaleAsync(locale) };
  return { translations };
}
