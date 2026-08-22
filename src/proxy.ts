import { getAll } from "@vercel/edge-config";
import { type NextRequest, NextResponse } from "next/server";

import { baseLocale, locales } from "#/i18n/i18n-util";
import { isDefaultLocalePublicMarketingPath } from "#/i18n/localeMigrationRouting";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";

const localeSet = new Set<string>(locales);

const INTERNAL_MARKETING_PREFIX = "/internal-marketing";

function withLocaleHeader(request: NextRequest, locale: string): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(APP_ROUTER_LOCALE_HEADER, locale);
  return requestHeaders;
}

function localeFromPathname(pathname: string): string | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && localeSet.has(segment)) {
    return segment;
  }
  return null;
}

/**
 * Next.js 16+ request proxy (replaces `middleware.ts`).
 *
 * - Serves `/api/config` from Edge Config.
 * - Sets {@link APP_ROUTER_LOCALE_HEADER} for App Router locale paths
 *   (`/internal-marketing/[locale]/*`, `/[lang]/*`, and L2 unprefixed default-locale marketing).
 *
 * Unprefixed `/`, `/privacy`, … are App `(default-locale)` routes (L2).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/config") {
    const config = await getAll();
    return NextResponse.json(config ?? {});
  }

  if (pathname.startsWith(`${INTERNAL_MARKETING_PREFIX}/`)) {
    const segment = pathname.split("/").filter(Boolean)[1];
    if (segment && localeSet.has(segment)) {
      return NextResponse.next({
        request: { headers: withLocaleHeader(request, segment) },
      });
    }
  }

  if (isDefaultLocalePublicMarketingPath(pathname)) {
    return NextResponse.next({
      request: { headers: withLocaleHeader(request, baseLocale) },
    });
  }

  const locale = localeFromPathname(pathname);
  if (locale) {
    return NextResponse.next({
      request: { headers: withLocaleHeader(request, locale) },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/config",
    "/",
    "/privacy",
    "/daily",
    "/playground/:path*",
    "/profile/:path*",
    {
      source: "/internal-marketing/:path*",
      locale: false,
    },
    {
      source: "/:locale",
      locale: false,
    },
    {
      source: "/:locale/:path*",
      locale: false,
    },
  ],
};
