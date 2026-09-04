import { expect, test } from "@playwright/test";

import {
  clickFooterPrivacyPolicyLink,
  dismissCookieBannerIfVisible,
} from "./helpers/dismissCookieBanner";
import {
  collectWebGlContextLostMessages,
  forceLoseActiveLandingWebGLContexts,
  waitForActiveLandingWebGLCanvases,
} from "./helpers/landingWebGLCanvases";
import { clickAppBarHomeLink } from "./helpers/playgroundMonacoEditor";

test.describe("home landing WebGL canvases", () => {
  test.describe.configure({ mode: "serial" });

  test("keep active WebGL contexts after client navigation away and back", async ({
    page,
  }) => {
    const contextLostMessages = collectWebGlContextLostMessages(page);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
    await waitForActiveLandingWebGLCanvases(page);

    await clickFooterPrivacyPolicyLink(page);
    await page.waitForURL((url) => url.pathname === "/privacy");

    await clickAppBarHomeLink(page);
    await page.waitForURL((url) => url.pathname === "/");

    const activeCanvases = await waitForActiveLandingWebGLCanvases(page);
    expect(activeCanvases.length).toBeGreaterThanOrEqual(2);
    expect(contextLostMessages).toEqual([]);
  });

  test("remounts landing canvases after forced WEBGL_lose_context", async ({
    page,
  }) => {
    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
    // Python decor lives below the fold; scroll so both models mount WebGL canvases.
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await waitForActiveLandingWebGLCanvases(page, 2, 30_000);

    const lostCount = await forceLoseActiveLandingWebGLContexts(page);
    expect(lostCount).toBeGreaterThanOrEqual(2);

    const recovered = await waitForActiveLandingWebGLCanvases(page, 2, 30_000);
    expect(recovered.length).toBeGreaterThanOrEqual(2);
  });
});
