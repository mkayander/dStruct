import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";

/** Validates a locale segment string. */
export function resolveLangParamSync(langParam: string): Locales | null {
  return locales.includes(langParam as Locales) ? (langParam as Locales) : null;
}

/** Validates `[lang]` route param; returns null when unsupported. */
export async function resolveLangParam(
  params: Promise<{ lang: string }>,
): Promise<Locales | null> {
  const { lang: langParam } = await params;
  return resolveLangParamSync(langParam);
}
