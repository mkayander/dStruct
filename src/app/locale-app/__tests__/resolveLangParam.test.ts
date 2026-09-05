import { describe, expect, it } from "vitest";

import { resolveLangParam, resolveLangParamSync } from "../resolveLangParam";

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

describe("resolveLangParamSync", () => {
  it("returns locale for supported lang segment", () => {
    expect(resolveLangParamSync("de")).toBe("de");
  });

  it("returns null for unsupported lang segment", () => {
    expect(resolveLangParamSync("zz")).toBeNull();
  });
});
