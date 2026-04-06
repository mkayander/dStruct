import { getAll } from "@vercel/edge-config";
import { type NextRequest, NextResponse } from "next/server";

import { locales } from "#/i18n/i18n-util";
import { APP_ROUTER_LOCALE_HEADER } from "#/shared/lib/appRouterLocaleHeader";

const localeSet = new Set<string>(locales);

const INTERNAL_MARKETING_PREFIX = "/internal-marketing";

function withLocaleHeader(request: NextRequest, locale: string): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(APP_ROUTER_LOCALE_HEADER, locale);
  return requestHeaders;
}

/**
 * Next.js 16+ request proxy (replaces `middleware.ts`). Handles `/api/config` and
 * rewrites public `/{locale}` URLs to `app/internal-marketing/[locale]` so App routes
 * do not shadow Pages (`/daily`, `/playground`, …).
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
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `${INTERNAL_MARKETING_PREFIX}/en`;
    return NextResponse.rewrite(url, {
      request: { headers: withLocaleHeader(request, "en") },
    });
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (first && localeSet.has(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `${INTERNAL_MARKETING_PREFIX}/${first}`;
    return NextResponse.rewrite(url, {
      request: { headers: withLocaleHeader(request, first) },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/config",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
