import type { Locales } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";

import { resolveLangParamSync } from "#/app/locale-app/resolveLangParam";

/** Resolves locale from optional App `[lang]` route params (default locale when absent). */
export async function resolvePageLocale(
  params?: Promise<{ lang?: string }>,
): Promise<Locales> {
  if (!params) {
    return baseLocale;
  }

  const { lang: langParam } = await params;
  if (!langParam) {
    return baseLocale;
  }

  return resolveLangParamSync(langParam) ?? baseLocale;
}
