import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import { hasProductionInstantShell } from "./helpers/instantNavigationShell";

/**
 * L5: hard navigation (MPA reload) instant shell for default-locale marketing.
 * Skips under `next dev` (instant MPA CSR-bails); runs on production / preview builds.
 */
test.describe("instant marketing hard navigation (L5)", () => {
  test.describe.configure({ mode: "serial" });

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

  test("home hero shell is instant on hard navigation", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);

    await instant(page, async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Your code, frame by frame.",
        { timeout: 30_000 },
      );
    });
  });

  test("privacy shell is instant on hard navigation", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/privacy");
    await dismissCookieBannerIfVisible(page);

    await instant(page, async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Privacy Policy",
        { timeout: 30_000 },
      );
    });
  });

  test("daily shell is instant on hard navigation", async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/daily");
    await dismissCookieBannerIfVisible(page);

    await instant(page, async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 4 })).toContainText(
        "Not sure what to solve?",
        { timeout: 30_000 },
      );
    });
  });
});
