import { afterEach, describe, expect, it, vi } from "vitest";

import {
  detectDomDisintegrateQualityTier,
  estimateParticleGridCells,
  getDomDisintegrateQualityOverrides,
  resolveParticleStepForSurface,
} from "../domDisintegrateQuality";
import type { DomDisintegrateDeviceProfile } from "../domDisintegrateQuality";

const originalNavigator = globalThis.navigator;
const originalMatchMedia = globalThis.matchMedia;

const setNavigator = (
  overrides: Partial<Navigator & { deviceMemory?: number }>,
) => {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { ...originalNavigator, ...overrides },
  });
};

const setMatchMedia = (queries: Record<string, boolean>) => {
  globalThis.matchMedia = vi.fn((query: string) => ({
    matches: queries[query] ?? false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

const profile = (
  overrides: Partial<DomDisintegrateDeviceProfile>,
): DomDisintegrateDeviceProfile => ({
  hardwareConcurrency: 8,
  deviceMemory: 8,
  prefersReducedMotion: false,
  coarsePointer: false,
  ...overrides,
});

afterEach(() => {
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: originalNavigator,
  });
  globalThis.matchMedia = originalMatchMedia;
});

describe("detectDomDisintegrateQualityTier", () => {
  it("returns high tier for desktop-class hardware", () => {
    expect(detectDomDisintegrateQualityTier(profile({}))).toBe("high");
  });

  it("returns medium tier for modern mobile (e.g. Nothing Phone 3 class)", () => {
    expect(
      detectDomDisintegrateQualityTier(
        profile({
          hardwareConcurrency: 8,
          deviceMemory: 8,
          coarsePointer: true,
        }),
      ),
    ).toBe("medium");
  });

  it("returns low tier for constrained hardware", () => {
    expect(
      detectDomDisintegrateQualityTier(
        profile({
          hardwareConcurrency: 2,
          deviceMemory: 2,
          coarsePointer: true,
        }),
      ),
    ).toBe("low");
  });

  it("returns low tier when prefers-reduced-motion is set", () => {
    expect(
      detectDomDisintegrateQualityTier(profile({ prefersReducedMotion: true })),
    ).toBe("low");
  });
});

describe("resolveParticleStepForSurface", () => {
  it("keeps base step when surface is within budget", () => {
    expect(resolveParticleStepForSurface(120, 40, 4, 1800)).toBe(4);
  });

  it("bumps step for wide mobile banners until grid fits budget", () => {
    const step = resolveParticleStepForSurface(400, 96, 4, 1800);

    expect(step).toBeGreaterThan(4);
    expect(estimateParticleGridCells(400, 96, step)).toBeLessThanOrEqual(1800);
  });
});

describe("getDomDisintegrateQualityOverrides", () => {
  it("applies medium-tier defaults for coarse-pointer mobile", () => {
    const overrides = getDomDisintegrateQualityOverrides(
      { displayWidth: 120, displayHeight: 40 },
      profile({ coarsePointer: true }),
    );

    expect(overrides.particleStep).toBe(4);
    expect(overrides.maxDuration).toBe(0.9);
    expect(overrides.maxChunkMaskSteps).toBe(64);
  });

  it("reads device profile from navigator when profile is omitted", () => {
    setNavigator({ hardwareConcurrency: 8, deviceMemory: 8 });
    setMatchMedia({ "(pointer: coarse)": true });

    const overrides = getDomDisintegrateQualityOverrides({
      displayWidth: 120,
      displayHeight: 40,
    });

    expect(overrides.particleStep).toBe(4);
    expect(overrides.maxDuration).toBe(0.9);
  });
});
