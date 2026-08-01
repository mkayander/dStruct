import { describe, expect, it, vi } from "vitest";

import { runThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate";

vi.mock("#/shared/lib/prefersReducedMotion", () => ({
  prefersReducedMotion: () => true,
}));

describe("runThanosDisintegrate", () => {
  it("no-ops when reduced motion is preferred", async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    await expect(runThanosDisintegrate(element)).resolves.toBeUndefined();
    expect(element.style.opacity).toBe("");
  });
});
