/** Escapes sequences that would break an embedded `<style>` block in HTML. */
export const sanitizeEmbeddedStyleCss = (css: string): string =>
  css.replace(/<\/style/gi, "<\\/style");

const collectRootFontVariableCss = (): string => {
  const rootStyle = window.getComputedStyle(document.documentElement);
  const sans = rootStyle.getPropertyValue("--font-app-sans").trim();
  const display = rootStyle.getPropertyValue("--font-app-display").trim();

  if (!sans && !display) {
    return "";
  }

  const declarations = [
    sans ? `--font-app-sans: ${sans};` : "",
    display ? `--font-app-display: ${display};` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `:root { ${declarations} }`;
};

/**
 * Collects `@font-face` rules from accessible document stylesheets so raster
 * captures (SVG foreignObject blobs) can use the same web fonts as the live UI.
 */
export const collectDocumentFontFaceCss = (): string => {
  const rules: string[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const cssRules = sheet.cssRules;
      for (let index = 0; index < cssRules.length; index += 1) {
        const rule = cssRules[index];
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          rules.push(rule.cssText);
        }
      }
    } catch {
      // Cross-origin stylesheets are not readable.
    }
  }

  return sanitizeEmbeddedStyleCss(rules.join("\n"));
};

/** Typography CSS injected into isolated capture documents (fonts + theme variables). */
export const collectCaptureTypographyCss = (): string =>
  sanitizeEmbeddedStyleCss(
    [collectRootFontVariableCss(), collectDocumentFontFaceCss()]
      .filter(Boolean)
      .join("\n"),
  );
