import { afterEach, describe, expect, it } from "vitest";

import {
  collectDocumentFontFaceCss,
  sanitizeEmbeddedStyleCss,
} from "#/shared/ui/effects/domDisintegrate/collectDocumentFontFaceCss";

describe("collectDocumentFontFaceCss", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("collects readable @font-face rules from document stylesheets", () => {
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.sheet?.insertRule(
      '@font-face { font-family: "Test Sans"; src: url("https://example.com/test.woff2") format("woff2"); }',
      0,
    );

    expect(collectDocumentFontFaceCss()).toContain('font-family: "Test Sans"');
  });

  it("escapes closing style tags inside css text", () => {
    expect(sanitizeEmbeddedStyleCss('content: "</style>"')).toBe(
      'content: "<\\/style>"',
    );
  });
});
