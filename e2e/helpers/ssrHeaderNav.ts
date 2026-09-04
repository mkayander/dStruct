import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

export const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

export const APP_BAR_TEST_ID = "app-bar";
export const APP_BAR_COMPACT_NAV_TEST_ID = "app-bar-compact-nav";
export const APP_BAR_NAV_PLAYGROUND_TEST_ID = "app-bar-nav-playground";
export const APP_BAR_NAV_DAILY_TEST_ID = "app-bar-nav-daily";

export function extractAppBarHtml(html: string): string | null {
  const match = html.match(
    new RegExp(
      `<header[^>]*data-testid="${APP_BAR_TEST_ID}"[\\s\\S]*?</header>`,
    ),
  );
  return match?.[0] ?? null;
}

export function appBarHtmlHasDesktopNav(appBarHtml: string): boolean {
  return (
    appBarHtml.includes(`data-testid="${APP_BAR_NAV_PLAYGROUND_TEST_ID}"`) &&
    appBarHtml.includes(`data-testid="${APP_BAR_NAV_DAILY_TEST_ID}"`) &&
    !appBarHtml.includes(`data-testid="${APP_BAR_COMPACT_NAV_TEST_ID}"`)
  );
}

export function appBarHtmlHasCompactNav(appBarHtml: string): boolean {
  return appBarHtml.includes(`data-testid="${APP_BAR_COMPACT_NAV_TEST_ID}"`);
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
