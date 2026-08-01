import { ThemeProvider } from "@mui/material/styles";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { theme } from "#/themes";

import { CookieConsentBannerWithDismissEffect } from "../CookieConsentBannerWithDismissEffect";

const disintegrateMock = vi.fn(async () => undefined);

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
  }),
}));

describe("CookieConsentBannerWithDismissEffect", () => {
  it("runs disintegrate before accept action", async () => {
    disintegrateMock.mockClear();
    const user = userEvent.setup();
    const onAcceptAll = vi.fn();

    render(
      <ThemeProvider theme={theme}>
        <CookieConsentBannerWithDismissEffect
          isSettingsView={false}
          onAcceptAll={onAcceptAll}
          onRejectNonEssential={vi.fn()}
          onClose={vi.fn()}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "COOKIE_ACCEPT_ALL" }));

    await waitFor(() => {
      expect(disintegrateMock).toHaveBeenCalledTimes(1);
      expect(onAcceptAll).toHaveBeenCalledTimes(1);
    });
  });
});
