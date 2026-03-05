import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn, useSession } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { makeStore } from "#/store/makeStore";
import { theme } from "#/themes";

import { MainAppBar } from "../MainAppBar";

const mockEnqueueSnackbar = vi.fn();

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({ pathname: "/playground" })),
}));

vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));

vi.mock("#/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
    useProfileImageUploader: vi.fn(),
  };
});

vi.mock("#/shared/hooks/useHasMounted", () => ({
  useHasMounted: () => true,
}));

vi.mock("#/shared/hooks/useMobileLayout", () => ({
  useMobileLayout: () => true,
}));

vi.mock("#/features/playground/hooks/useMobilePlaygroundView", () => ({
  useMobilePlaygroundView: () => ({
    currentView: "code" as const,
  }),
}));

const mockOpenBrowser = vi.fn();
vi.mock("#/features/project/ui/ProjectBrowser/ProjectBrowserContext", () => ({
  useProjectBrowserContext: () => ({
    openBrowser: mockOpenBrowser,
  }),
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const store = makeStore();
  return render(
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </ReduxProvider>,
  );
};

describe("MainAppBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    } as ReturnType<typeof useSession>);
  });

  it("shows error snackbar when signIn throws on mobile playground", async () => {
    vi.mocked(signIn).mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<MainAppBar toolbarVariant="dense" />);

    await userEvent.click(screen.getByRole("button", { name: "SIGN_IN" }));

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Network error", {
      variant: "error",
    });
  });

  it("shows localized fallback when signIn throws non-Error on mobile playground", async () => {
    vi.mocked(signIn).mockRejectedValueOnce("Unknown error");

    renderWithProviders(<MainAppBar toolbarVariant="dense" />);

    await userEvent.click(screen.getByRole("button", { name: "SIGN_IN" }));

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith("SIGN_IN_FAILED", {
      variant: "error",
    });
  });
});
