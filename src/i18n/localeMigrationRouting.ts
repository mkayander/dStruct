/** Unprefixed default-locale marketing paths served by App `(default-locale)` (L2). */
export function isDefaultLocalePublicMarketingPath(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }
  if (pathname === "/privacy" || pathname === "/daily") {
    return true;
  }
  if (pathname === "/playground" || pathname.startsWith("/playground/")) {
    return true;
  }
  if (pathname.startsWith("/profile/")) {
    return true;
  }
  return false;
}
