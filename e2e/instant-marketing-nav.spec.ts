import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";

/**
 * L5: marketing pages use `instant = true`; client navigations between them are validated.
 * Serial mode avoids `next-instant-navigation-testing` cookie races on localhost.
 */
test.describe("instant marketing navigations (L5)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
  });

  test("privacy is instant on client navigation from home", async ({
    page,
  }) => {
    await instant(page, async () => {
      await page.getByRole("link", { name: /privacy policy/i }).click();
      await page.waitForURL((url) => url.pathname === "/privacy");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Privacy Policy",
      );
    });
  });

  test("daily shell is instant on client navigation from home", async ({
    page,
  }) => {
    await instant(page, async () => {
      await page.getByRole("link", { name: /daily problem/i }).click();
      await page.waitForURL((url) => url.pathname === "/daily");
      await expect(page.getByRole("heading", { level: 4 })).toContainText(
        "Not sure what to solve?",
      );
    });
  });

  test("home hero is instant on client navigation from privacy", async ({
    page,
  }) => {
    await page.goto("/privacy");
    await dismissCookieBannerIfVisible(page);

    await instant(page, async () => {
      await page
        .getByRole("link", { name: /dstruct/i })
        .first()
        .click();
      await page.waitForURL((url) => url.pathname === "/");
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Your code, frame by frame.",
      );
    });
  });
});
