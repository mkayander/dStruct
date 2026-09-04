import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import {
  APP_BAR_COMPACT_NAV_TEST_ID,
  APP_BAR_NAV_DAILY_TEST_ID,
  APP_BAR_NAV_PLAYGROUND_TEST_ID,
  appBarHtmlHasCompactNav,
  appBarHtmlHasDesktopNav,
  DESKTOP_USER_AGENT,
  extractAppBarHtml,
  fetchDocumentHtml,
  MOBILE_USER_AGENT,
} from "./helpers/ssrHeaderNav";

test.describe("SSR app bar navigation", () => {
  test("desktop HTML renders full Playground and Daily links in the app bar", async ({
    request,
  }) => {
    for (const path of ["/", "/playground"] as const) {
      const html = await fetchDocumentHtml(request, path, DESKTOP_USER_AGENT);
      const appBarHtml = extractAppBarHtml(html);
      expect(appBarHtml, `app bar missing on ${path}`).not.toBeNull();
      expect(appBarHtmlHasDesktopNav(appBarHtml ?? "")).toBe(true);
    }
  });

  test("mobile playground HTML renders compact hamburger app bar nav", async ({
    request,
  }) => {
    const html = await fetchDocumentHtml(
      request,
      "/playground",
      MOBILE_USER_AGENT,
    );
    const appBarHtml = extractAppBarHtml(html);
    expect(appBarHtml).not.toBeNull();
    expect(appBarHtmlHasCompactNav(appBarHtml ?? "")).toBe(true);
  });

  test("desktop browser shows full app bar links without hamburger menu", async ({
    page,
  }) => {
    await page.goto("/playground", { waitUntil: "domcontentloaded" });
    await dismissCookieBannerIfVisible(page);

    await expect(
      page.getByTestId(APP_BAR_NAV_PLAYGROUND_TEST_ID),
    ).toBeVisible();
    await expect(page.getByTestId(APP_BAR_NAV_DAILY_TEST_ID)).toBeVisible();
    await expect(page.getByTestId(APP_BAR_COMPACT_NAV_TEST_ID)).toHaveCount(0);
  });
});
