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

  it("does not instrument top-level functions outside the returned solution", () => {
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

  it("instruments return arrow function with block body", () => {
    const code = `return () => {
  const n = 1;
  return n;
};`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
    expect(out).toContain("globalThis.__dstructSetExecutionSource");
  });

  it("replaces array literals with __dstructArrayLiteral in solution", () => {
    const code = `return function f() {
  const a = [1, 2];
  return a;
};`;
    const { code: out, ok } = instrumentUserJsForLineTracking(code);
    expect(ok).toBe(true);
    expect(out).toContain("__dstructArrayLiteral(1, 2)");
  });
});
