import { describe, expect, it } from "vitest";

import { instrumentUserJsForLineTracking } from "#/features/codeRunner/lib/instrumentUserJsForLineTracking";

describe("instrumentUserJsForLineTracking", () => {
  it("injects line probes before statements in the returned solution function", () => {
    const code = `return function sum(a) {
  return a + 1;
};`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
    expect(out).toContain("globalThis.__dstructSetExecutionSource");
  });

  it("still transforms array literals when line probes cannot run", () => {
    const code = `function run() {
  const a = [1, 2];
  return a;
}
return run;`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(false);
    expect(out).toContain('__dstructArrayLiteralWithName("a", 1, 2)');
    expect(out).not.toContain("__dstructSetExecutionSource");
  });

  it("does not instrument top-level helpers outside the returned solution", () => {
    const code = `function helper() {
  return 1;
}
return function main() {
  const x = helper();
  return x + 1;
};`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
    const probeMatches = out.match(/globalThis\.__dstructSetExecutionSource/g);
    expect(probeMatches?.length).toBe(2);
    const helperIdx = out.indexOf("function helper");
    const firstProbeAfterHelper = out.indexOf(
      "globalThis.__dstructSetExecutionSource",
      helperIdx,
    );
    const mainIdx = out.indexOf("function main");
    expect(mainIdx).toBeGreaterThan(helperIdx);
    expect(firstProbeAfterHelper).toBeGreaterThan(mainIdx);
  });
});
