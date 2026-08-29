import { instant } from "@next/playwright";
import { type APIRequestContext, expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";

/** Instant MPA mode includes prerendered marketing copy only with a production PPR shell. */
async function hasProductionInstantShell(
  request: APIRequestContext,
  path: string,
  expectedSnippet: string,
): Promise<boolean> {
  const response = await request.get(path, {
    headers: { cookie: "next-instant-navigation-testing=1" },
  });
  if (!response.ok()) {
    return false;
  }
  const html = await response.text();
  return html.includes(expectedSnippet);
}

/**
 * L5: hard navigation (MPA reload) instant shell for default-locale marketing.
 * Skips under `next dev` (instant MPA bails to CSR); runs on production / preview builds.
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
