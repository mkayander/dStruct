import { expect, type Page } from "@playwright/test";

/** Playground code panel uses Monaco (desktop split layout and mobile code view). */
export async function waitForPlaygroundMonacoEditor(
  page: Page,
  timeoutMs = 30_000,
): Promise<void> {
  const editorLines = page.locator(".monaco-editor .view-lines").first();
  await expect(editorLines).toBeVisible({ timeout: timeoutMs });
}

export function collectMonacoRuntimeErrors(page: Page): string[] {
  const messages: string[] = [];

  page.on("console", (message) => {
    const type = message.type();
    if (type !== "error" && type !== "warning") {
      return;
    }

    const text = message.text();
    if (
      /instantiationservice has been disposed/i.test(text) ||
      /reading 'domnode'/i.test(text) ||
      /renderText/i.test(text)
    ) {
      messages.push(text);
    }
  });

  page.on("pageerror", (error) => {
    const text = error.message;
    if (
      /instantiationservice has been disposed/i.test(text) ||
      /reading 'domnode'/i.test(text) ||
      /renderText/i.test(text)
    ) {
      messages.push(text);
    }
  });

  return messages;
}

export function collectPythonRunnerRuntimeErrors(page: Page): string[] {
  const messages: string[] = [];

  const maybeCollect = (text: string) => {
    if (
      /pythonrunner has been disposed/i.test(text) ||
      /pythonrunner init superseded/i.test(text) ||
      /pythonrunner released/i.test(text) ||
      /worker crashed/i.test(text)
    ) {
      messages.push(text);
    }
  };

  page.on("console", (message) => {
    if (message.type() === "error") {
      maybeCollect(message.text());
    }
  });

  page.on("pageerror", (error) => {
    maybeCollect(error.message);
  });

  return messages;
}

/**
 * Brand link back to marketing home.
 * Targets the visible banner link — Cache Components / Activity can leave hidden
 * route trees (with their own app bars) in the DOM. DOM `.click()` avoids MUI
 * Typography intercepting Playwright pointer events on the nested `<h6>`.
 */
export async function clickAppBarHomeLink(page: Page): Promise<void> {
  const homeLink = page
    .getByRole("banner")
    .getByRole("link", { name: /dstruct/i })
    .locator("visible=true")
    .last();

  await homeLink.scrollIntoViewIfNeeded();
  await expect(homeLink).toBeVisible({ timeout: 15_000 });
  await homeLink.evaluate((element) => {
    (element as HTMLAnchorElement).click();
  });
}
