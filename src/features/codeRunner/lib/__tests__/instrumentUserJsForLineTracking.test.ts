import { describe, expect, it } from "vitest";

import { instrumentUserJsForLineTracking } from "#/features/codeRunner/lib/instrumentUserJsForLineTracking";

describe("instrumentUserJsForLineTracking", () => {
  it("injects globalThis.__dstructSetExecutionSource before statements in returned function", () => {
    const code = `return function sum(a) {
  return a + 1;
};`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
    expect(out).toContain("__dstructSetExecutionSource");
    expect(out).toContain("globalThis.__dstructSetExecutionSource");
  });

  it("instruments nested function bodies", () => {
    const code = `return function outer() {
  function inner() {
    return 1;
  }
  return inner();
};`;
    const { ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
  });

  it("skips instrumentation when there is no return function template", () => {
    const code = `function run() { return 1; }
return run;`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(false);
    expect(out).toBe(code);
  });
});
