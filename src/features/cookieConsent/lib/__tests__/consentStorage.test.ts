import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearStoredCookieConsent,
  getStoredCookieConsent,
  storeCookieConsent,
  subscribeCookieConsent,
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

    expect(stored?.analytics).toBe(true);
    expect(stored?.decidedAt).toBeTruthy();
    expect(getStoredCookieConsent()).toEqual(stored);
  });

  it("stores rejected non-essential consent", () => {
    const stored = storeCookieConsent({ analytics: false });

    expect(stored?.analytics).toBe(false);
    expect(getStoredCookieConsent()?.analytics).toBe(false);
  });

  it("ignores invalid stored payloads", () => {
    localStorage.setItem("dstruct-cookie-consent", "{ invalid json");

    expect(getStoredCookieConsent()).toBeNull();
  });

  it("notifies subscribers when consent changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCookieConsent(listener);

    storeCookieConsent({ analytics: true });

    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });
});
