/** Public Pages Router playground prefix (canonical URLs). */
export const PLAYGROUND_PUBLIC_BASE_PATH = "/playground";

const INTERNAL_MARKETING_PREFIX = "/internal-marketing";

export type ParsedPlaygroundRoute = {
  basePath: string;
  slug: string[];
};

/** App Router pilot base for a locale segment. */
export function internalMarketingPlaygroundBasePath(locale: string): string {
  return `${INTERNAL_MARKETING_PREFIX}/${locale}/playground`;
}

/**
 * Parses `/playground/...` or `/internal-marketing/{locale}/playground/...`.
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

  const pilotMatch = pathOnly.match(
    /^\/internal-marketing\/([^/]+)\/playground(?:\/(.*))?$/,
  );
  if (pilotMatch) {
    const locale = pilotMatch[1] ?? "";
    const slugPart = pilotMatch[2];
    const slug = slugPart
      ? slugPart.split("/").filter((segment) => segment.length > 0)
      : [];
    return {
      basePath: internalMarketingPlaygroundBasePath(locale),
      slug,
    };
  }

  return null;
}

/** Builds a playground path under the given base (public or pilot). Empty segments are omitted. */
export function buildPlaygroundPath(basePath: string, slug: string[]): string {
  const segments = slug.filter((segment) => segment.length > 0);
  if (segments.length === 0) {
    return basePath;
  }
  return `${basePath}/${segments.join("/")}`;
}

/**
 * Remaps slug segments from a stored playground path onto `targetBasePath`.
 * Used when restoring last project on pilot vs public routes.
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
