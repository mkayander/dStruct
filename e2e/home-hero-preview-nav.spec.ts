import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";

import {
  clickFooterPrivacyPolicyLink,
  dismissCookieBannerIfVisible,
} from "./helpers/dismissCookieBanner";
import { clickAppBarHomeLink } from "./helpers/playgroundMonacoEditor";

test.describe("home hero preview instant navigation", () => {
  test.describe.configure({ mode: "serial" });

  test("keeps playback controls after instant nav away and back", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);

    const previewHeading = page.getByRole("heading", {
      name: "Time-travel playback",
      exact: true,
    });
    await expect(previewHeading).toBeVisible();
    const playButton = page.getByRole("button", { name: "Play", exact: true });
    await expect(playButton).toBeEnabled({ timeout: 30_000 });

    await instant(page, async () => {
      await clickFooterPrivacyPolicyLink(page);
      await page.waitForURL((url) => url.pathname === "/privacy");
    });

    await instant(page, async () => {
      await clickAppBarHomeLink(page);
      await page.waitForURL((url) => url.pathname === "/");
    });

    await expect(previewHeading).toBeVisible();
    await expect(playButton).toBeEnabled({ timeout: 30_000 });
  });
});
