import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import { hasProductionInstantShell } from "./helpers/instantNavigationShell";

/**
 * P10: profile opts into `instant = true` with Suspense skeleton fallback.
 */
test.describe("instant profile navigation (P10)", () => {
  test("profile is instant on client back navigation from playground", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const userId = "e2e-app-lang-user";

    await page.goto(`/profile/${userId}`);
    await dismissCookieBannerIfVisible(page);
    await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();

    await page.getByRole("link", { name: "Playground" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/playground"));

    await instant(page, async () => {
      await page.goBack();
      await page.waitForURL((url) =>
        url.pathname.endsWith(`/profile/${userId}`),
      );
      await expect(page.getByRole("heading", { level: 4 })).toContainText(
        /sign in|dashboard|profil|save progress/i,
        { timeout: 30_000 },
      );
    });
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
        await expect(page.getByRole("heading", { level: 4 })).toContainText(
          /sign in|dashboard|profil|save progress/i,
          { timeout: 30_000 },
        );
      });
    });
  });
});
