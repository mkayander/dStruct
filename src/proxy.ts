import { getAll } from "@vercel/edge-config";
import { type NextRequest, NextResponse } from "next/server";

import { baseLocale, locales } from "#/i18n/i18n-util";
import { isDefaultLocalePublicMarketingPath } from "#/i18n/localeMigrationRouting";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";
import { parsePlaygroundPathname } from "#/shared/lib/playgroundRoute";
import { applyDeviceHintResponseHeaders } from "#/shared/lib/ssrDevice";

const localeSet = new Set<string>(locales);

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

function nextWithLocaleHeader(
  request: NextRequest,
  locale: string,
  pathname: string,
): NextResponse {
  const response = NextResponse.next({
    request: { headers: withLocaleHeader(request, locale) },
  });
  if (parsePlaygroundPathname(pathname)) {
    applyDeviceHintResponseHeaders(response);
  }
  return response;
}

/**
 * Next.js 16+ request proxy (replaces `middleware.ts`).
 *
 * - Serves `/api/config` from Edge Config.
 * - Sets {@link APP_ROUTER_LOCALE_HEADER} for App Router locale paths
 *   (`/[lang]/*` and L2 unprefixed default-locale marketing).
 * - Sets `Accept-CH` / `Vary` on playground paths for SSR device hints.
 *
 * Unprefixed `/`, `/privacy`, … are App `(default-locale)` routes (L2).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/config") {
    const config = await getAll();
    return NextResponse.json(config ?? {});
  }

  if (isDefaultLocalePublicMarketingPath(pathname)) {
    return nextWithLocaleHeader(request, baseLocale, pathname);
  }

  const locale = localeFromPathname(pathname);
  if (locale) {
    return nextWithLocaleHeader(request, locale, pathname);
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
      source: "/:locale",
      locale: false,
    },
    {
      source: "/:locale/:path*",
      locale: false,
    },
  ],
};
