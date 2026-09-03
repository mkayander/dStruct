import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

export const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

/** Hamburger nav in {@link MainAppBar} when `useCompactNav` is true. */
export const COMPACT_APP_BAR_NAV_MARKER = 'aria-controls="menu-appbar"';

export function extractAppBarHtml(html: string): string | null {
  const match = html.match(/<header[^>]*MuiAppBar-root[\s\S]*?<\/header>/);
  return match?.[0] ?? null;
}

export function appBarHtmlHasDesktopNav(appBarHtml: string): boolean {
  return (
    appBarHtml.includes('href="/playground"') &&
    appBarHtml.includes('href="/daily"') &&
    !appBarHtml.includes(COMPACT_APP_BAR_NAV_MARKER)
  );
}

export function appBarHtmlHasCompactNav(appBarHtml: string): boolean {
  return appBarHtml.includes(COMPACT_APP_BAR_NAV_MARKER);
}

export async function fetchDocumentHtml(
  request: APIRequestContext,
  path: string,
  userAgent: string,
): Promise<string> {
  const response = await request.get(path, {
    headers: { "user-agent": userAgent },
  });
  expect(response.ok()).toBe(true);
  return response.text();
}
