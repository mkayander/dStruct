/** CSS variable names — must match literal `variable` in `appFonts.ts` (Turbopack requires literals there). */
export const FONT_VAR_SANS = "--font-app-sans";
export const FONT_VAR_DISPLAY = "--font-app-display";

/** Body / UI stack (MUI default typography). */
export const appFontStackSans = `var(${FONT_VAR_SANS}), system-ui, sans-serif`;

/** Headings + display accents (paired with Inter). */
export const appFontStackDisplay = `var(${FONT_VAR_DISPLAY}), var(${FONT_VAR_SANS}), system-ui, sans-serif`;
