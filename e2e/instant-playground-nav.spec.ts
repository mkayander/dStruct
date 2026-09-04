import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import {
  visiblePlaygroundMonacoEditor,
  waitForPlaygroundMonacoEditor,
} from "./helpers/playgroundMonacoEditor";

/**
 * L5: playground opts into `instant = true` with Suspense skeleton fallback.
 */
test.describe("instant playground navigation (L5)", () => {
  test("playground shell is instant on client navigation from home", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
    await page.evaluate(() => {
      localStorage.removeItem("lastPlaygroundPath");
    });

    await instant(page, async () => {
      await page.getByTestId("cta-to-playground").click();
      await page.waitForURL(
        (url) => url.pathname === "/playground/invert-binary-tree",
        { timeout: 30_000 },
      );
    });

    await waitForPlaygroundMonacoEditor(page);
    await expect(visiblePlaygroundMonacoEditor(page)).toBeVisible();
  });
});
