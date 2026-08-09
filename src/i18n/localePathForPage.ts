import type { Locales } from "#/i18n/i18n-types";
import { baseLocale } from "#/i18n/i18n-util";

/**
 * Path segment (after origin) for a page under Next.js i18n locale prefixing.
 *
 * Default locale omits the prefix (`/daily`); others use `/{locale}/daily`.
 */
export function localePathForPage(
  locale: Locales,
  pagePath: string,
  defaultLocale: Locales = baseLocale,
): string {
  const normalized = pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
  if (locale === defaultLocale) {
    return normalized || "/";
  }
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}
