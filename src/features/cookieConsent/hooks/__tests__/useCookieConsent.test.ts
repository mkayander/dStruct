import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useCookieConsent } from "#/features/cookieConsent/hooks/useCookieConsent";
import { clearStoredCookieConsent } from "#/features/cookieConsent/lib/consentStorage";

describe("useCookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    clearStoredCookieConsent();
  });

  it("shows the banner when consent is undecided", () => {
    const { result } = renderHook(() => useCookieConsent());

    expect(result.current.showBanner).toBe(true);
    expect(result.current.analyticsEnabled).toBe(false);
  });

  it("hides the banner after accepting analytics", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.acceptAll();
    });

    expect(result.current.showBanner).toBe(false);
    expect(result.current.analyticsEnabled).toBe(true);
  });

  it("reopens settings without clearing stored consent", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.acceptAll();
    });

    act(() => {
      result.current.openCookieSettings();
    });

    expect(result.current.showBanner).toBe(true);
    expect(result.current.isSettingsView).toBe(true);
    expect(result.current.analyticsEnabled).toBe(true);
  });

  it("withdraws analytics consent when rejecting from settings", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => {
      result.current.acceptAll();
      result.current.openCookieSettings();
      result.current.rejectNonEssential();
    });

    expect(result.current.analyticsEnabled).toBe(false);
    expect(result.current.showBanner).toBe(false);
  });
});
