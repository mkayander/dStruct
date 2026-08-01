import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { theme } from "#/themes";

import { CookieConsentBanner } from "../CookieConsentBanner";

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

const renderBanner = (options?: { isSettingsView?: boolean }) => {
  const onAcceptAll = vi.fn();
  const onRejectNonEssential = vi.fn();
  const onClose = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <CookieConsentBanner
        isSettingsView={options?.isSettingsView ?? false}
        onAcceptAll={onAcceptAll}
        onRejectNonEssential={onRejectNonEssential}
        onClose={onClose}
      />
    </ThemeProvider>,
  );

  return { onAcceptAll, onRejectNonEssential, onClose };
};

describe("CookieConsentBanner", () => {
  it("renders accept and reject actions", () => {
    renderBanner();

    expect(
      screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "COOKIE_REJECT_NON_ESSENTIAL" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PRIVACY_POLICY" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("calls handlers when buttons are clicked", async () => {
    const user = userEvent.setup();
    const { onAcceptAll, onRejectNonEssential } = renderBanner();

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));
    await user.click(
      screen.getByRole("button", { name: "COOKIE_REJECT_NON_ESSENTIAL" }),
    );

    expect(onAcceptAll).toHaveBeenCalledTimes(1);
    expect(onRejectNonEssential).toHaveBeenCalledTimes(1);
  });

  it("shows settings copy and close control in settings view", async () => {
    const user = userEvent.setup();
    const { onClose } = renderBanner({ isSettingsView: true });

    expect(screen.getByText("COOKIE_SETTINGS_TITLE")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "COOKIE_SETTINGS_CLOSE" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
