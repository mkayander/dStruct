export const SITE_ORIGIN = "https://dstruct.pro" as const;

export const SITE_HOSTNAME = new URL(SITE_ORIGIN).hostname;

/** Path + query segment from Next.js `resolvedUrl` (drops hash only). */
export const pathnameFromResolvedUrl = (resolvedUrl: string): string => {
  const pathAndQuery = resolvedUrl.split("#")[0] ?? resolvedUrl;
  return pathAndQuery.split("?")[0] ?? pathAndQuery;
};

/** Canonical URL from a request path (e.g. Next.js `resolvedUrl` without query). */
export const absoluteUrlFromPathname = (pathname: string): string => {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path}`;
};

export const DEFAULT_SITE_DESCRIPTION =
  "dStruct is a web app that helps you understand LeetCode problems. It allows you to visualize your solutions that you write in a built-in code editor.";

const DEFAULT_OG_IMAGE_PATH = "/static/screen2.png";

export const DEFAULT_OG_IMAGE_URL = `${SITE_ORIGIN}${DEFAULT_OG_IMAGE_PATH}` as const;

/** Escape text for use inside XML element text (e.g. sitemap `<loc>`). */
export const escapeXmlText = (unsafe: string): string =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Keep meta descriptions within a typical snippet-friendly length. */
export const truncateMetaDescription = (text: string, maxLength = 155): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};
