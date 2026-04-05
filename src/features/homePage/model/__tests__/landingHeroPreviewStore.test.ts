import { describe, expect, it } from "vitest";

import type { CallFrame } from "#/features/callstack/model/callstackSlice";
import { createLandingHeroPreviewStore } from "#/features/homePage/model/landingHeroPreviewStore";

const isSetColorFrame = (
  frame: CallFrame | undefined,
): frame is Extract<CallFrame, { name: "setColor" }> =>
  Boolean(frame && frame.name === "setColor");

describe("createLandingHeroPreviewStore", () => {
  it("normalizes initial setColor frames so rewind can clear highlights", () => {
    const store = createLandingHeroPreviewStore();
    const frames = Object.values(store.getState().callstack.frames.entities);
    const initialHighlightFrame = frames.find(
      (frame) =>
        isSetColorFrame(frame) &&
        frame.args.color === "green" &&
        frame.prevArgs?.color === null &&
        frame.prevArgs?.animation === null,
    );

    expect(initialHighlightFrame).toBeDefined();
  });
});
