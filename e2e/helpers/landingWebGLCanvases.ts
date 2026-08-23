import type { Page } from "@playwright/test";

export type WebGLCanvasState = {
  width: number;
  height: number;
  contextLost: boolean;
};

/** Decorative landing canvases are R3F WebGL (not 2d/metrics). */
export async function readLandingWebGLCanvasStates(
  page: Page,
): Promise<WebGLCanvasState[]> {
  return page.evaluate(() => {
    const states: WebGLCanvasState[] = [];

    for (const canvas of document.querySelectorAll("canvas")) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        continue;
      }

      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!context) {
        continue;
      }

      states.push({
        width: canvas.width,
        height: canvas.height,
        contextLost: context.isContextLost(),
      });
    }

    return states;
  });
}

const isActiveLandingCanvas = (state: WebGLCanvasState) =>
  !state.contextLost && state.width >= 64 && state.height >= 64;

/** Home mounts two decorative models (hero tree + Python section). */
export async function waitForActiveLandingWebGLCanvases(
  page: Page,
  expectedMin = 2,
  timeoutMs = 20_000,
): Promise<WebGLCanvasState[]> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const states = await readLandingWebGLCanvasStates(page);
    const active = states.filter(isActiveLandingCanvas);
    if (active.length >= expectedMin) {
      return active;
    }
    await page.waitForTimeout(250);
  }

  const lastStates = await readLandingWebGLCanvasStates(page);
  throw new Error(
    `Expected at least ${expectedMin} active WebGL canvases, got ${lastStates.filter(isActiveLandingCanvas).length}: ${JSON.stringify(lastStates)}`,
  );
}

export function collectWebGlContextLostMessages(page: Page): string[] {
  const messages: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    if (/webglrenderer:\s*context lost/i.test(text)) {
      messages.push(text);
    }
  });
  return messages;
}
