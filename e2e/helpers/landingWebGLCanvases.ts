import { expect, type Page } from "@playwright/test";

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

export async function countActiveLandingWebGLCanvases(
  page: Page,
): Promise<number> {
  const states = await readLandingWebGLCanvasStates(page);
  return states.filter(isActiveLandingCanvas).length;
}

/** Home mounts two decorative models (hero tree + Python section). */
export async function waitForActiveLandingWebGLCanvases(
  page: Page,
  expectedMin = 2,
  timeoutMs = 20_000,
): Promise<WebGLCanvasState[]> {
  await expect
    .poll(async () => countActiveLandingWebGLCanvases(page), {
      timeout: timeoutMs,
    })
    .toBeGreaterThanOrEqual(expectedMin);

  const states = await readLandingWebGLCanvasStates(page);
  return states.filter(isActiveLandingCanvas);
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

const MIN_LANDING_CANVAS_DIMENSION_PX = 64;

/** Forces WEBGL_lose_context on active landing-sized WebGL canvases (recovery e2e). */
export async function forceLoseActiveLandingWebGLContexts(
  page: Page,
): Promise<number> {
  return page.evaluate((minDimension) => {
    let lost = 0;
    for (const canvas of document.querySelectorAll("canvas")) {
      if (!(canvas instanceof HTMLCanvasElement)) {
        continue;
      }
      if (canvas.width < minDimension || canvas.height < minDimension) {
        continue;
      }

      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!context || context.isContextLost()) {
        continue;
      }

      const extension = context.getExtension("WEBGL_lose_context");
      if (extension) {
        extension.loseContext();
        lost += 1;
      }
    }
    return lost;
  }, MIN_LANDING_CANVAS_DIMENSION_PX);
}
