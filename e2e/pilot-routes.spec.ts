import { expect, test } from "@playwright/test";

/**
 * Smoke tests for `/internal-marketing/[locale]/*` App Router pilots.
 *
 * `@next/playwright` `instant()` tests require `cacheComponents` + `unstable_instant`
 * (blocked until Next 16.3.x + locale migration). These assert pilot routes render and
 * stay noindex with public canonicals.
 */
test.describe("internal-marketing pilot routes", () => {
  test("home is noindex with public canonical", async ({ page }) => {
    await page.goto("/internal-marketing/en");
    await expect(page).toHaveTitle(/dStruct/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/",
    );
  });

  test("privacy pilot is noindex with public canonical", async ({ page }) => {
    await page.goto("/internal-marketing/en/privacy");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });

  test("daily pilot is noindex with public canonical", async ({ page }) => {
    await page.goto("/internal-marketing/de/daily");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de/daily",
    );
  });

  test("playground landing pilot is noindex with public canonical", async ({
    page,
  }) => {
    await page.goto("/internal-marketing/en/playground");
    await expect(page).toHaveTitle(/Playground/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/playground",
    );
  });

  test("profile pilot is noindex with public canonical", async ({ page }) => {
    const userId = "e2e-test-user";
    await page.goto(`/internal-marketing/en/profile/${userId}`);
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

  test("pilot home footer links to public privacy page", async ({ page }) => {
    await page.goto("/internal-marketing/en");
    await page.getByRole("link", { name: /privacy policy/i }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});
