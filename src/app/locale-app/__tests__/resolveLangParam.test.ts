import { describe, expect, it } from "vitest";

import { resolveLangParam } from "../resolveLangParam";

describe("resolveLangParam", () => {
  it("returns locale for supported lang param", async () => {
    await expect(
      resolveLangParam(Promise.resolve({ lang: "de" })),
    ).resolves.toBe("de");
  });

  it("returns null for unsupported lang param", async () => {
    await expect(
      resolveLangParam(Promise.resolve({ lang: "zz" })),
    ).resolves.toBeNull();
  });
});
