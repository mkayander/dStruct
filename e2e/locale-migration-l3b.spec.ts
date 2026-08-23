import { expect, test } from "@playwright/test";

/**
 * L3b: legacy `/internal-marketing/*` and duplicate `/en/*` URLs 308 to public App routes.
 */
test.describe("locale migration L3b legacy redirects", () => {
  test("legacy URLs respond with 308 permanent redirect", async ({
    request,
  }) => {
    const response = await request.get("/internal-marketing/en/privacy", {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/privacy");
  });

  test("internal-marketing en home redirects to /", async ({ page }) => {
    const response = await page.goto("/internal-marketing/en");
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/dStruct/);
  });

  test("internal-marketing en privacy redirects to /privacy", async ({
    page,
  }) => {
    await page.goto("/internal-marketing/en/privacy");
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });

  test("internal-marketing de daily redirects to /de/daily", async ({
    page,
  }) => {
    await page.goto("/internal-marketing/de/daily");
    await expect(page).toHaveURL(/\/de\/daily$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/de/daily",
    );
  });

  test("internal-marketing en playground redirects to /playground", async ({
    page,
  }) => {
    await page.goto("/internal-marketing/en/playground");
    await expect(page).toHaveURL(/\/playground$/);
    await expect(page).toHaveTitle(/Playground/i);
  });

  test("internal-marketing en profile redirects to /profile/:userId", async ({
    page,
  }) => {
    const userId = "e2e-test-user";
    await page.goto(`/internal-marketing/en/profile/${userId}`);
    await expect(page).toHaveURL(new RegExp(`/profile/${userId}$`));
    await expect(page).toHaveTitle(/Profile/i);
  });

  test("/en/privacy redirects to unprefixed /privacy", async ({ page }) => {
    await page.goto("/en/privacy");
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dstruct.pro/privacy",
    );
  });
});
