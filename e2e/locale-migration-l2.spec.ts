import { expect, test } from "@playwright/test";

/**
 * Smoke tests for locale migration L2: unprefixed default-locale URLs serve App
 * `(default-locale)/*`. Explicit `/en/*` may also serve App `[lang]` with the same canonicals.
 */
test.describe("locale migration L2 public URLs", () => {
  test("unprefixed home is indexable with public canonical", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/dStruct/);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/",
    );
  });

  test("unprefixed privacy is indexable with public canonical", async ({
    page,
  }) => {
    await page.goto("/privacy");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });

  test("unprefixed daily is indexable with public canonical", async ({
    page,
  }) => {
    await page.goto("/daily");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/daily",
    );
  });

  test("explicit /en/privacy serves unprefixed canonical", async ({ page }) => {
    await page.goto("/en/privacy");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });
});
