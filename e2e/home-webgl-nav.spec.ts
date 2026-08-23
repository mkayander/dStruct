import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import {
  collectWebGlContextLostMessages,
  waitForActiveLandingWebGLCanvases,
} from "./helpers/landingWebGLCanvases";

test.describe("home landing WebGL canvases", () => {
  test.describe.configure({ mode: "serial" });

  test("keep active WebGL contexts after client navigation away and back", async ({
    page,
  }) => {
    const contextLostMessages = collectWebGlContextLostMessages(page);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
    await waitForActiveLandingWebGLCanvases(page);

    await page.getByRole("link", { name: /privacy policy/i }).click();
    await page.waitForURL((url) => url.pathname === "/privacy");

    await page
      .getByRole("link", { name: /dstruct/i })
      .first()
      .click();
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
    await waitForActiveLandingWebGLCanvases(page);

    const lostCount = await page.evaluate(() => {
      let lost = 0;
      for (const canvas of document.querySelectorAll("canvas")) {
        if (!(canvas instanceof HTMLCanvasElement)) {
          continue;
        }
        const context =
          canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        const extension = context?.getExtension("WEBGL_lose_context");
        if (extension) {
          extension.loseContext();
          lost += 1;
        }
      }
      return lost;
    });

    expect(lostCount).toBeGreaterThanOrEqual(1);

    const recovered = await waitForActiveLandingWebGLCanvases(page);
    expect(recovered.length).toBeGreaterThanOrEqual(2);
  });
});
