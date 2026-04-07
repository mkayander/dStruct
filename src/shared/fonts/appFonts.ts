import { Inter, Space_Grotesk } from "next/font/google";

// `variable` must be string literals (Turbopack/next/font compile-time check).
// Keep names in sync with `FONT_VAR_SANS` / `FONT_VAR_DISPLAY` in `fontVariables.ts`.
/** Body / UI sans — loaded via next/font (no extra Google Fonts `<link>`). */
export const fontSans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-app-sans",
});

/** Display / headings — weights aligned with MUI `h1`–`h4` and `subtitle2`. */
export const fontDisplay = Space_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-app-display",
});

/**
 * Set on `<Html>` in `_document` so `var(--font-app-*)` inherits to `body` (globals + MUI CssBaseline).
 * Also import this module from `_app` so Next injects font CSS on the client — `_document` alone is not enough.
 */
export const fontVariableClassNames = `${fontSans.variable} ${fontDisplay.variable}`;
