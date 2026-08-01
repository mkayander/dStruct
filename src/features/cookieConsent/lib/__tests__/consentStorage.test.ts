import { beforeEach, describe, expect, it } from "vitest";

import {
  clearStoredCookieConsent,
  getStoredCookieConsent,
  storeCookieConsent,
} from "#/features/cookieConsent/lib/consentStorage";

describe("consentStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    clearStoredCookieConsent();
  });

  it("returns null when no consent is stored", () => {
    expect(getStoredCookieConsent()).toBeNull();
  });

  it("stores and retrieves analytics consent", () => {
    const stored = storeCookieConsent({ analytics: true });

    expect(stored.analytics).toBe(true);
    expect(stored.decidedAt).toBeTruthy();
    expect(getStoredCookieConsent()).toEqual(stored);
  });

  it("stores rejected non-essential consent", () => {
    const stored = storeCookieConsent({ analytics: false });

    expect(stored.analytics).toBe(false);
    expect(getStoredCookieConsent()?.analytics).toBe(false);
  });

  it("ignores invalid stored payloads", () => {
    localStorage.setItem("dstruct-cookie-consent", "{ invalid json");

    expect(getStoredCookieConsent()).toBeNull();
  });
});
