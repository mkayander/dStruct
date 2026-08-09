import { describe, expect, it } from "vitest";

import { internalMarketingPilotMetadata } from "#/app/internal-marketing/internalMarketingPilotMetadata";

describe("internalMarketingPilotMetadata", () => {
  it("sets noindex and public canonical for pilot home", () => {
    const metadata = internalMarketingPilotMetadata({
      locale: "de",
      pagePath: "/",
      title: "dStruct",
      description: "Test description",
    });

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("https://dstruct.pro/de");
    expect(metadata.title).toBe("dStruct");
  });

  it("uses locale-prefixed canonical for non-home pages", () => {
    const metadata = internalMarketingPilotMetadata({
      locale: "en",
      pagePath: "/privacy",
      title: "Privacy",
      description: "Intro",
    });

    expect(metadata.alternates?.canonical).toBe("https://dstruct.pro/privacy");
  });
});
