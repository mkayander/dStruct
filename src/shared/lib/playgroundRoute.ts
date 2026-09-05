import { baseLocale, locales } from "#/i18n/i18n-util";

/** Public App Router playground prefix (canonical URLs). */
export const PLAYGROUND_PUBLIC_BASE_PATH = "/playground";

const localeCodeSet = new Set<string>(locales);

export type ParsedPlaygroundRoute = {
  basePath: string;
  slug: string[];
};

/** App Router public base: `/{lang}/playground` (L1 locale migration). */
export function appLocalePlaygroundBasePath(lang: string): string {
  return `/${lang}/playground`;
}

/** Canonical playground base for a locale (unprefixed for default locale). */
export function playgroundBasePathForLocale(locale: string): string {
  if (locale === baseLocale) {
    return PLAYGROUND_PUBLIC_BASE_PATH;
  }
  return appLocalePlaygroundBasePath(locale);
}

/**
 * Parses `/playground/...`, legacy `/internal-marketing/{locale}/playground/...`,
 * or `/{lang}/playground/...` when `lang` is a known locale.
 *
 * Legacy pilot paths normalize to public bases (bookmarks / localStorage).
 */
export function parsePlaygroundPathname(
  pathname: string,
): ParsedPlaygroundRoute | null {
  const pathOnly = pathname.split("?")[0] ?? pathname;

  if (
    pathOnly === PLAYGROUND_PUBLIC_BASE_PATH ||
    pathOnly.startsWith(`${PLAYGROUND_PUBLIC_BASE_PATH}/`)
  ) {
    const remainder = pathOnly.slice(PLAYGROUND_PUBLIC_BASE_PATH.length);
    const slug = remainder
      .replace(/^\//, "")
      .split("/")
      .filter((segment) => segment.length > 0);
    return { basePath: PLAYGROUND_PUBLIC_BASE_PATH, slug };
  }

  const legacyPilotMatch = pathOnly.match(
    /^\/internal-marketing\/([^/]+)\/playground(?:\/(.*))?$/,
  );
  if (legacyPilotMatch) {
    const locale = legacyPilotMatch[1] ?? "";
    const slugPart = legacyPilotMatch[2];
    const slug = slugPart
      ? slugPart.split("/").filter((segment) => segment.length > 0)
      : [];
    return {
      basePath: playgroundBasePathForLocale(locale),
      slug,
    };
  }

  const appLocaleMatch = pathOnly.match(/^\/([^/]+)\/playground(?:\/(.*))?$/);
  if (appLocaleMatch && localeCodeSet.has(appLocaleMatch[1] ?? "")) {
    const lang = appLocaleMatch[1] ?? "";
    const slugPart = appLocaleMatch[2];
    const slug = slugPart
      ? slugPart.split("/").filter((segment) => segment.length > 0)
      : [];
    return {
      basePath: playgroundBasePathForLocale(lang),
      slug,
    };
  }

  return null;
}

/** Builds a playground path under the given base. Empty segments are omitted. */
export function buildPlaygroundPath(basePath: string, slug: string[]): string {
  const segments = slug.filter((segment) => segment.length > 0);
  if (segments.length === 0) {
    return basePath;
  }
  return `${basePath}/${segments.join("/")}`;
}

/**
 * Remaps slug segments from a stored playground path onto `targetBasePath`.
 * Used when restoring last project across public vs locale-prefixed routes.
 */
export function remapPlaygroundPathToBase(
  path: string,
  targetBasePath: string,
): string | null {
  const parsed = parsePlaygroundPathname(path);
  if (!parsed?.slug[0] || parsed.slug[0].startsWith("[[")) {
    return null;
  }
  return buildPlaygroundPath(targetBasePath, parsed.slug);
}
