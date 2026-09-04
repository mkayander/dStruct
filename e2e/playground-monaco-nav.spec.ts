import { expect, test } from "@playwright/test";

import { dismissCookieBannerIfVisible } from "./helpers/dismissCookieBanner";
import {
  clickAppBarHomeLink,
  collectMonacoRuntimeErrors,
  collectPythonRunnerRuntimeErrors,
  visiblePlaygroundMonacoEditor,
  waitForPlaygroundMonacoEditor,
} from "./helpers/playgroundMonacoEditor";

const PLAYGROUND_PYTHON_URL =
  "/playground/invert-binary-tree?view=code&language=python";

test.describe("playground runtime navigation", () => {
  test.describe.configure({ mode: "serial" });

  test("remounts Monaco after home and playground navigations", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const monacoErrors = collectMonacoRuntimeErrors(page);

    await page.goto("/");
    await dismissCookieBannerIfVisible(page);
    await page.evaluate(() => {
      localStorage.removeItem("lastPlaygroundPath");
    });

    for (let roundIndex = 0; roundIndex < 3; roundIndex += 1) {
      await page.getByTestId("cta-to-playground").click();
      await page.waitForURL(
        (url) => url.pathname === "/playground/invert-binary-tree",
        { timeout: 30_000 },
      );
      await waitForPlaygroundMonacoEditor(page);

      await clickAppBarHomeLink(page);
      await page.waitForURL((url) => url.pathname === "/", {
        timeout: 30_000,
      });
      await dismissCookieBannerIfVisible(page);
    }

    await page.goto("/playground/invert-binary-tree?view=code");
    await dismissCookieBannerIfVisible(page);
    await waitForPlaygroundMonacoEditor(page);

    await expect(visiblePlaygroundMonacoEditor(page)).toBeVisible();
    expect(monacoErrors).toEqual([]);
  });

  test("releases Pyodide worker after leaving playground with Python selected", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    const runtimeErrors = [
      ...collectMonacoRuntimeErrors(page),
      ...collectPythonRunnerRuntimeErrors(page),
    ];

    await page.goto(PLAYGROUND_PYTHON_URL);
    await dismissCookieBannerIfVisible(page);
    await waitForPlaygroundMonacoEditor(page);

    await clickAppBarHomeLink(page);
    await page.waitForURL((url) => url.pathname === "/", { timeout: 30_000 });

    await page.goto(PLAYGROUND_PYTHON_URL);
    await dismissCookieBannerIfVisible(page);
    await waitForPlaygroundMonacoEditor(page);

    await expect(visiblePlaygroundMonacoEditor(page)).toBeVisible();
    expect(runtimeErrors).toEqual([]);
  });
});
