import type { Metadata, Viewport } from "next";

/** Document head parity with `pages/_document.tsx` for App Router routes. */
export const appDocumentViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121212",
};

export const appDocumentMetadata: Metadata = {
  other: {
    "darkreader-lock": "",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "dStruct",
    "msapplication-TileColor": "#121212",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    ],
  },
  manifest: "/site.webmanifest",
};

/** Material Icons stylesheet (text fonts load via `next/font` in `appFonts.ts`). */
export const materialIconsStylesheetHref =
  "https://fonts.googleapis.com/icon?family=Material+Icons";
