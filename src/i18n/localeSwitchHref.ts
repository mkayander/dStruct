import type { Locales } from "#/i18n/i18n-types";
import { baseLocale, locales } from "#/i18n/i18n-util";
import { localePathForPage } from "#/i18n/localePathForPage";

const localeSet = new Set<string>(locales);

export function parseLocaleFromPathname(pathname: string): {
  pagePath: string;
  locale: Locales;
} {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const segments = normalized.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && localeSet.has(firstSegment)) {
    const rest = segments.slice(1);
    return {
      locale: firstSegment as Locales,
      pagePath: rest.length === 0 ? "/" : `/${rest.join("/")}`,
    };
  }
  return { locale: baseLocale, pagePath: normalized || "/" };
}

/** Same-page href when switching locale (preserves path + query). */
export function localeSwitchHref(
  pathname: string,
  searchParams: string,
  targetLocale: Locales,
): string {
  const { pagePath } = parseLocaleFromPathname(pathname);
  const href = localePathForPage(targetLocale, pagePath);
  if (!searchParams) {
    return href;
  }
  return `${href}?${searchParams}`;
}
