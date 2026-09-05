import { ThemeProvider } from "@mui/material/styles";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import type * as Notistack from "notistack";
import { useState } from "react";
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

const enqueueSnackbarMock = vi.fn();

vi.mock("notistack", async (importOriginal) => {
  const actual = await importOriginal<typeof Notistack>();
  return {
    ...actual,
    useSnackbar: () => ({
      enqueueSnackbar: enqueueSnackbarMock,
      closeSnackbar: vi.fn(),
    }),
  };
});

describe("CookieConsentBannerWithDismissEffect", () => {
  const renderBanner = (props: {
    onAcceptAll?: () => boolean;
    onBeginDismiss?: () => void;
    onCompleteDismiss?: () => void;
  }) =>
    render(
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CookieConsentBannerWithDismissEffect
            isSettingsView={false}
            onAcceptAll={props.onAcceptAll ?? vi.fn(() => true)}
            onRejectNonEssential={vi.fn()}
            onClose={vi.fn()}
            onBeginDismiss={props.onBeginDismiss ?? vi.fn()}
            onCompleteDismiss={props.onCompleteDismiss ?? vi.fn()}
          />
        </SnackbarProvider>
      </ThemeProvider>,
    );

  it("persists consent before the disintegrate animation finishes", async () => {
    disintegrateMock.mockClear();
    enqueueSnackbarMock.mockClear();
    const user = userEvent.setup();
    const onAcceptAll = vi.fn(() => true);
    const onBeginDismiss = vi.fn();
    const onCompleteDismiss = vi.fn();

    renderBanner({ onAcceptAll, onBeginDismiss, onCompleteDismiss });

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    expect(onBeginDismiss).toHaveBeenCalledTimes(1);
    expect(onAcceptAll).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(disintegrateMock).toHaveBeenCalledTimes(1);
    });
    expect(disintegrateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        maskMode: "radial",
        origin: expect.objectContaining({
          clientX: expect.any(Number),
          clientY: expect.any(Number),
        }),
      }),
    );
    expect(onCompleteDismiss).not.toHaveBeenCalled();

    resolveDisintegrate?.();
    await waitFor(() => {
      expect(onCompleteDismiss).toHaveBeenCalledTimes(1);
    });
  });

  it("skips the disintegrate animation when consent persistence fails", async () => {
    disintegrateMock.mockClear();
    enqueueSnackbarMock.mockClear();
    const user = userEvent.setup();
    const onAcceptAll = vi.fn(() => false);
    const onBeginDismiss = vi.fn();
    const onCompleteDismiss = vi.fn();

    renderBanner({ onAcceptAll, onBeginDismiss, onCompleteDismiss });

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    expect(onAcceptAll).toHaveBeenCalledTimes(1);
    expect(onBeginDismiss).not.toHaveBeenCalled();
    expect(disintegrateMock).not.toHaveBeenCalled();
    expect(onCompleteDismiss).not.toHaveBeenCalled();
  });

  it("keeps settings view frozen while close dismiss animation is pending", async () => {
    disintegrateMock.mockClear();
    const user = userEvent.setup();

    const SettingsCloseHarness = () => {
      const [isSettingsView, setIsSettingsView] = useState(true);

      return (
        <ThemeProvider theme={theme}>
          <SnackbarProvider>
            <CookieConsentBannerWithDismissEffect
              isSettingsView={isSettingsView}
              onAcceptAll={vi.fn(() => true)}
              onRejectNonEssential={vi.fn()}
              onClose={() => {
                setIsSettingsView(false);
              }}
              onBeginDismiss={vi.fn()}
              onCompleteDismiss={vi.fn()}
            />
          </SnackbarProvider>
        </ThemeProvider>
      );
    };

    render(<SettingsCloseHarness />);

    await user.click(
      screen.getByRole("button", { name: "COOKIE_SETTINGS_CLOSE" }),
    );

    expect(screen.getByText("COOKIE_SETTINGS_TITLE")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "COOKIE_SETTINGS_CLOSE" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(disintegrateMock).toHaveBeenCalledTimes(1);
    });

    resolveDisintegrate?.();
    await waitFor(() => {
      expect(
        screen.queryByText("COOKIE_SETTINGS_TITLE"),
      ).not.toBeInTheDocument();
    });
  });

  it("still completes dismiss and shows a warning when the animation fails", async () => {
    disintegrateMock.mockClear();
    enqueueSnackbarMock.mockClear();
    disintegrateMock.mockRejectedValueOnce(new Error("animation failed"));

    const user = userEvent.setup();
    const onBeginDismiss = vi.fn();
    const onCompleteDismiss = vi.fn();

    renderBanner({ onBeginDismiss, onCompleteDismiss });

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    await waitFor(() => {
      expect(onCompleteDismiss).toHaveBeenCalledTimes(1);
    });
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(
      "COOKIE_DISMISS_ANIMATION_FAILED",
      { variant: "warning" },
    );
  });
});
