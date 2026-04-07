import { Inter, Space_Grotesk } from "next/font/google";

import { FONT_VAR_DISPLAY, FONT_VAR_SANS } from "#/shared/fonts/fontVariables";

/** Body / UI sans — loaded via next/font (no extra Google Fonts `<link>`). */
export const fontSans = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: FONT_VAR_SANS,
});

/** Display / headings — weights aligned with MUI `h1`–`h4` and `subtitle2`. */
export const fontDisplay = Space_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: FONT_VAR_DISPLAY,
});

/** Set on `<Html>` in `_document` so `var(--font-app-*)` resolves everywhere. */
export const fontVariableClassNames = `${fontSans.variable} ${fontDisplay.variable}`;
