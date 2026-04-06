import type { Locales } from "./i18n-types";

/** Locales that use right-to-left layout for the document root. */
export const rtlLocales: ReadonlySet<Locales> = new Set(["ar"]);

export const getDocumentTextDirection = (locale: string): "ltr" | "rtl" =>
  rtlLocales.has(locale as Locales) ? "rtl" : "ltr";
