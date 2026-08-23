import type { Page } from "@playwright/test";

/** Dismiss the cookie consent banner when present (fresh preview / CI sessions). */
export async function dismissCookieBannerIfVisible(page: Page): Promise<void> {
  const rejectButton = page.getByRole("button", {
    name: /reject non-essential/i,
  });
  const isVisible = await rejectButton.isVisible().catch(() => false);
  if (!isVisible) {
    return;
  }
  await rejectButton.click();
  await rejectButton
    .waitFor({ state: "hidden", timeout: 15_000 })
    .catch(() => undefined);
}

/** Footer privacy link (avoids cookie-banner duplicate when banner is still open). */
export async function clickFooterPrivacyPolicyLink(page: Page): Promise<void> {
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: /privacy policy/i })
    .click();
}
