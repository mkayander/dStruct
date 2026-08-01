import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { theme } from "#/themes";

import { CookieConsentBanner } from "../CookieConsentBanner";

vi.mock("#/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

const renderBanner = () => {
  const onAcceptAll = vi.fn();
  const onRejectNonEssential = vi.fn();

  render(
    <ThemeProvider theme={theme}>
      <CookieConsentBanner
        onAcceptAll={onAcceptAll}
        onRejectNonEssential={onRejectNonEssential}
      />
    </ThemeProvider>,
  );

  return { onAcceptAll, onRejectNonEssential };
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
});
