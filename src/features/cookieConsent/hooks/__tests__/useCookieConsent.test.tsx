import { ThemeProvider } from "@mui/material/styles";
import { renderHook, act } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearStoredCookieConsent } from "#/features/cookieConsent/lib/consentStorage";
import type * as SharedHooks from "#/shared/hooks";
import { theme } from "#/themes";

vi.mock("#/shared/hooks", async (importOriginal) => {
  const { mockUseI18nContext } = await import("#/shared/testUtils");
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

const { useCookieConsent } = await import(
  "#/features/cookieConsent/hooks/useCookieConsent"
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SnackbarProvider>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </SnackbarProvider>
);

describe("useCookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    clearStoredCookieConsent();
  });

  it("shows the banner when consent is undecided", () => {
    const { result } = renderHook(() => useCookieConsent(), { wrapper });

    expect(result.current.showBanner).toBe(true);
    expect(result.current.analyticsEnabled).toBe(false);
  });

  it("hides the banner after accepting analytics", () => {
    const { result } = renderHook(() => useCookieConsent(), { wrapper });

    let accepted = false;
    act(() => {
      accepted = result.current.acceptAll();
    });

    expect(accepted).toBe(true);
    expect(result.current.showBanner).toBe(false);
    expect(result.current.analyticsEnabled).toBe(true);
  });

  it("reopens settings without clearing stored consent", () => {
    const { result } = renderHook(() => useCookieConsent(), { wrapper });

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
    const { result } = renderHook(() => useCookieConsent(), { wrapper });

    act(() => {
      result.current.acceptAll();
      result.current.openCookieSettings();
      result.current.rejectNonEssential();
    });

    expect(result.current.analyticsEnabled).toBe(false);
    expect(result.current.showBanner).toBe(false);
  });
});
