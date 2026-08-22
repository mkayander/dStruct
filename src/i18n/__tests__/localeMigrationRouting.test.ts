import { describe, expect, it } from "vitest";

import { isDefaultLocalePublicMarketingPath } from "#/i18n/localeMigrationRouting";

describe("localeMigrationRouting", () => {
  it("detects default-locale public marketing paths", () => {
    expect(isDefaultLocalePublicMarketingPath("/")).toBe(true);
    expect(isDefaultLocalePublicMarketingPath("/privacy")).toBe(true);
    expect(isDefaultLocalePublicMarketingPath("/playground/foo")).toBe(true);
    expect(isDefaultLocalePublicMarketingPath("/profile/u1")).toBe(true);
    expect(isDefaultLocalePublicMarketingPath("/de")).toBe(false);
    expect(isDefaultLocalePublicMarketingPath("/api/trpc")).toBe(false);
  });
});
