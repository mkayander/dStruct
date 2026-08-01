import { ThemeProvider } from "@mui/material/styles";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { theme } from "#/themes";

import { CookieConsentBannerWithDismissEffect } from "../CookieConsentBannerWithDismissEffect";

let resolveDisintegrate: (() => void) | undefined;

const disintegrateMock = vi.fn(
  () =>
    new Promise<void>((resolve) => {
      resolveDisintegrate = resolve;
    }),
);

vi.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/" }),
}));

vi.mock("#/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

vi.mock("#/shared/ui/effects/thanosDisintegrate", () => ({
  useThanosDisintegrate: () => ({
    targetRef: { current: null },
    disintegrate: disintegrateMock,
    invalidateCapture: vi.fn(),
  }),
}));

describe("CookieConsentBannerWithDismissEffect", () => {
  it("persists consent before the disintegrate animation finishes", async () => {
    disintegrateMock.mockClear();
    const user = userEvent.setup();
    const onAcceptAll = vi.fn(() => true);
    const onBeginDismiss = vi.fn();
    const onCompleteDismiss = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <CookieConsentBannerWithDismissEffect
          isSettingsView={false}
          onAcceptAll={onAcceptAll}
          onRejectNonEssential={vi.fn()}
          onClose={vi.fn()}
          onBeginDismiss={onBeginDismiss}
          onCompleteDismiss={onCompleteDismiss}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    expect(onBeginDismiss).toHaveBeenCalledTimes(1);
    expect(onAcceptAll).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(disintegrateMock).toHaveBeenCalledTimes(1);
      expect(disintegrateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: expect.objectContaining({
            clientX: expect.any(Number),
            clientY: expect.any(Number),
          }),
        }),
      );
    });
    expect(onCompleteDismiss).not.toHaveBeenCalled();

    resolveDisintegrate?.();
    await waitFor(() => {
      expect(onCompleteDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it("skips the disintegrate animation when consent persistence fails", async () => {
    disintegrateMock.mockClear();
    const user = userEvent.setup();
    const onAcceptAll = vi.fn(() => false);
    const onBeginDismiss = vi.fn();
    const onCompleteDismiss = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <CookieConsentBannerWithDismissEffect
          isSettingsView={false}
          onAcceptAll={onAcceptAll}
          onRejectNonEssential={vi.fn()}
          onClose={vi.fn()}
          onBeginDismiss={onBeginDismiss}
          onCompleteDismiss={onCompleteDismiss}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    expect(onAcceptAll).toHaveBeenCalledTimes(1);
    expect(onBeginDismiss).not.toHaveBeenCalled();
    expect(disintegrateMock).not.toHaveBeenCalled();
    expect(onCompleteDismiss).not.toHaveBeenCalled();
  });
});
