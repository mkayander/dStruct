import { expect, test } from "@playwright/test";

/**
 * Smoke tests for public `app/[lang]/*` routes (locale migration L1).
 *
 * Default locale (`en`) is served from `(default-locale)/` at unprefixed URLs;
 * see `e2e/locale-migration-l2.spec.ts` and `e2e/locale-migration-l3b.spec.ts`.
 */
test.describe("app/[lang] public routes (non-default locales)", () => {
  test("de home is indexable with locale canonical", async ({ page }) => {
    await page.goto("/de");
    await expect(page).toHaveTitle(/dStruct/);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de",
    );
  });

  test("ar home sets rtl document direction from proxy locale header", async ({
    page,
  }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("de privacy is indexable with locale canonical", async ({ page }) => {
    await page.goto("/de/privacy");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de/privacy",
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

  test("de playground landing is indexable with locale canonical", async ({
    page,
  }) => {
    await page.goto("/de/playground");
    await expect(page).toHaveTitle(/Playground/i);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de/playground",
    );
  });

  test("de profile is noindex with locale canonical", async ({ page }) => {
    const userId = "e2e-app-lang-user";
    await page.goto(`/de/profile/${userId}`);
    await expect(page).toHaveTitle(/Profil|Profile/i);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://dstruct.pro/de/profile/${userId}`,
    );
  });
});
