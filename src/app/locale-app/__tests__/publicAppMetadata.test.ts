import { describe, expect, it } from "vitest";

import { publicAppMetadata } from "#/app/locale-app/publicAppMetadata";

describe("publicAppMetadata", () => {
  it("sets indexable canonical for default-locale home via /en path", () => {
    const metadata = publicAppMetadata({
      locale: "en",
      pagePath: "/",
      title: "dStruct",
      description: "Test description",
    });

    expect(metadata.robots).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe("https://dstruct.pro/");
    expect(metadata.title).toBe("dStruct");
  });

  it("uses locale-prefixed canonical for non-default locales", () => {
    const metadata = publicAppMetadata({
      locale: "de",
      pagePath: "/privacy",
      title: "Privacy",
      description: "Intro",
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://dstruct.pro/de/privacy",
    );
  });

  it("emits noindex when indexable is false", () => {
    const metadata = publicAppMetadata({
      locale: "en",
      pagePath: "/profile/user-1",
      title: "Profile",
      description: "Intro",
      indexable: false,
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});
