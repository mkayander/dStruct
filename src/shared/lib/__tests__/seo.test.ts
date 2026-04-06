import { describe, expect, it } from "vitest";

import { escapeXmlText, pathnameFromResolvedUrl } from "#/shared/lib/seo";

describe("seo helpers", () => {
  it("escapeXmlText escapes XML special characters", () => {
    expect(escapeXmlText(`a&b<c>"d"'e'`)).toBe(
      "a&amp;b&lt;c&gt;&quot;d&quot;&apos;e&apos;",
    );
  });

  it("pathnameFromResolvedUrl strips hash and query", () => {
    expect(pathnameFromResolvedUrl("/ru/playground?q=1#frag")).toBe(
      "/ru/playground",
    );
  });
});
