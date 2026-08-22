import { describe, expect, it } from "vitest";

import {
  appDocumentMetadata,
  appDocumentViewport,
} from "#/shared/lib/appDocumentMetadata";

describe("appDocumentMetadata", () => {
  it("sets themeColor for PWA chrome parity with _document", () => {
    expect(appDocumentViewport.themeColor).toBe("#121212");
  });

  it("includes mobile PWA meta via Metadata other (non-empty values)", () => {
    expect(appDocumentMetadata.other).toMatchObject({
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#121212",
    });
    expect(appDocumentMetadata.other).not.toHaveProperty("darkreader-lock");
  });
});
