import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import { hasProductionInstantShell } from "./helpers/instantNavigationShell";
import { APP_BAR_NAV_PLAYGROUND_TEST_ID } from "./helpers/ssrHeaderNav";

const profileHeadingPattern = /sign in|dashboard|profil|save progress/i;

/**
 * P10: profile opts into `instant = true` with Suspense skeleton fallback.
 * Match playground instant e2e: validate navigation inside `instant()`; deferred
 * client UI (session-driven copy) after the instant callback completes.
 */
test.describe("instant profile navigation (P10)", () => {
  test("profile is instant on client back navigation from playground", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const userId = "e2e-app-lang-user";

    await page.goto(`/profile/${userId}`);
    await dismissCookieBannerIfVisible(page);
    await expect(
      page.getByTestId(APP_BAR_NAV_PLAYGROUND_TEST_ID),
    ).toBeVisible();

    await page.getByTestId(APP_BAR_NAV_PLAYGROUND_TEST_ID).click();
    await page.waitForURL((url) => url.pathname.startsWith("/playground"));

    await instant(page, async () => {
      await page.goBack();
      await page.waitForURL((url) =>
        url.pathname.endsWith(`/profile/${userId}`),
      );
    });

    await expect(page.getByTestId("profile-auth-heading")).toContainText(
      profileHeadingPattern,
      { timeout: 30_000 },
    );
  });

  test.describe("hard navigation (production PPR shell)", () => {
    test.beforeAll(async ({ request }) => {
      const shellReady = await hasProductionInstantShell(
        request,
        "/",
        "Your code, frame by frame.",
      );
      test.skip(
        !shellReady,
        "Requires production PPR shell (instant MPA CSR-bails in next dev)",
      );
    });

    test("profile shell is instant on hard navigation", async ({ page }) => {
      test.setTimeout(120_000);

      await page.goto("/profile/e2e-app-lang-user");
      await dismissCookieBannerIfVisible(page);

      await instant(page, async () => {
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page.getByTestId("profile-page-skeleton")).toBeVisible({
          timeout: 30_000,
        });
      });

      await expect(page.getByTestId("profile-auth-heading")).toContainText(
        profileHeadingPattern,
        { timeout: 30_000 },
      );
    });
  });
});
