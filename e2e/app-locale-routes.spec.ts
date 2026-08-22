import { expect, test } from "@playwright/test";

/**
 * Smoke tests for public `app/[lang]/*` routes (locale migration L1).
 *
 * URLs use an explicit locale prefix (`/en`, `/de/...`). Unprefixed `/` and
 * `/privacy` remain Pages Router until L2/L3 cutover.
 */
test.describe("app/[lang] public routes", () => {
  test("en home is indexable with public canonical", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/dStruct/);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/",
    );
  });

  test("en privacy is indexable with public canonical", async ({ page }) => {
    await page.goto("/en/privacy");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });

  test("de daily is indexable with locale canonical", async ({ page }) => {
    await page.goto("/de/daily");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de/daily",
    );
  });

  test("en playground landing is indexable with public canonical", async ({
    page,
  }) => {
    await page.goto("/en/playground");
    await expect(page).toHaveTitle(/Playground/i);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/playground",
    );
  });

  test("en profile is noindex with public canonical", async ({ page }) => {
    const userId = "e2e-app-lang-user";
    await page.goto(`/en/profile/${userId}`);
    await expect(page).toHaveTitle(/Profile/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://dstruct.pro/profile/${userId}`,
    );
  });
});
