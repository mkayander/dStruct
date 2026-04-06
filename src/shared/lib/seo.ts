/**
 * SEO utilities: production site URL, canonical building, meta description shaping,
 * and XML escaping for sitemaps. Keeps search/social behavior consistent with one origin.
 */

/** Absolute origin of the public site (scheme + host, no trailing slash). */
export const SITE_ORIGIN = "https://dstruct.pro" as const;

/** Hostname only, derived from {@link SITE_ORIGIN} (e.g. for `twitter:domain`). */
export const SITE_HOSTNAME = new URL(SITE_ORIGIN).hostname;

/**
 * Extracts the pathname from Next.js `getServerSideProps` / router `resolvedUrl`.
 *
 * Strips the hash and query string so canonical URLs point at a single path per page
 * (e.g. `/ru/playground/foo` from `/ru/playground/foo?q=1#x`).
 *
 * @param resolvedUrl - Value from Next.js context `resolvedUrl` (path, may include query/hash).
 * @returns Pathname starting with `/`, or empty string if missing.
 */
export const pathnameFromResolvedUrl = (resolvedUrl: string): string => {
  const pathAndQuery = resolvedUrl.split("#")[0] ?? resolvedUrl;
  return pathAndQuery.split("?")[0] ?? pathAndQuery;
};

/**
 * Builds an absolute canonical URL for a pathname on this site.
 *
 * @param pathname - Path starting with `/` (leading slash added if omitted).
 * @returns Full URL with {@link SITE_ORIGIN}.
 */
export const absoluteUrlFromPathname = (pathname: string): string => {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path}`;
};

/** Default HTML/Open Graph/Twitter description when a page does not override it. */
export const DEFAULT_SITE_DESCRIPTION =
  "dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor.";

const DEFAULT_OG_IMAGE_PATH = "/static/screen2.png";

/** Default Open Graph / Twitter image URL for pages that do not set a custom preview image. */
export const DEFAULT_OG_IMAGE_URL = `${SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}` as const;

/**
 * Escapes `& < > " '` so a string is safe inside XML text nodes (e.g. sitemap `<loc>`).
 *
 * @param unsafe - Raw string (e.g. URL path segments or slugs from the database).
 * @returns XML-safe text content.
 */
export const escapeXmlText = (unsafe: string): string =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Normalizes whitespace and truncates to a length suitable for search result snippets
 * (~155 characters is a common guideline; not a hard platform limit).
 *
 * @param text - Raw description; collapsed to single spaces.
 * @param maxLength - Maximum characters before appending an ellipsis (default 155).
 * @returns Trimmed description, with `…` if truncated.
 */
export const truncateMetaDescription = (text: string, maxLength = 155): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};
