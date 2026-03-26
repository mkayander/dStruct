import { describe, expect, it } from "vitest";

import {
  LANDING_PLAYGROUND_DEMOS,
  LANDING_PRIMARY_PLAYGROUND_HREF,
} from "./landingPlaygroundDemos";

describe("landingPlaygroundDemos", () => {
  it("keeps a fixed count of curated demos with unique hrefs", () => {
    expect(LANDING_PLAYGROUND_DEMOS).toHaveLength(4);
    const hrefs = LANDING_PLAYGROUND_DEMOS.map((d) => d.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses code view on every demo link", () => {
    for (const { href } of LANDING_PLAYGROUND_DEMOS) {
      expect(href).toMatch(/^\/playground\/[^?]+\?view=code$/);
    }
  });

  it("ties primary CTA href to the first demo", () => {
    expect(LANDING_PRIMARY_PLAYGROUND_HREF).toBe(
      LANDING_PLAYGROUND_DEMOS[0]?.href,
    );
  });
});
