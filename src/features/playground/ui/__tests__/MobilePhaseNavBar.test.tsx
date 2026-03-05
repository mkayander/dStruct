import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as ReduxProvider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import type * as SharedHooks from "#/shared/hooks";
import { mockUseI18nContext } from "#/shared/testUtils";
import { makeStore } from "#/store/makeStore";
import { theme } from "#/themes";

import { MobilePhaseNavBar } from "../MobilePhaseNavBar";

const mockPush = vi.fn();
const mockGoToBrowse = vi.fn();
const mockGoToCode = vi.fn();
const mockGoToResults = vi.fn();

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("#/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof SharedHooks>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

vi.mock("#/features/playground/hooks/useMobilePlaygroundView", () => ({
  useMobilePlaygroundView: vi.fn(),
}));

vi.mock("#/store/hooks", () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(() => vi.fn()),
}));

const useMobilePlaygroundView = vi.mocked(
  await import("#/features/playground/hooks/useMobilePlaygroundView").then(
    (m) => m.useMobilePlaygroundView,
  ),
);
const useAppSelector = vi.mocked(
  await import("#/store/hooks").then((m) => m.useAppSelector),
);

const renderWithProviders = (
  ui: React.ReactElement,
  options?: { hasResults?: boolean },
) => {
  useAppSelector.mockImplementation((selector) => {
    if (selector === selectCallstackIsReady) {
      return options?.hasResults ?? false;
    }
    const store = makeStore();
    return selector(store.getState());
  });

  const store = makeStore();
  return render(
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </ReduxProvider>,
  );
};

describe("MobilePhaseNavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls router.push('/') when Back is clicked on browse view", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "browse",
      hasProjectSlug: false,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("button", { name: "BACK" }));

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockGoToBrowse).not.toHaveBeenCalled();
    expect(mockGoToCode).not.toHaveBeenCalled();
  });

  it("calls goToBrowse when Back is clicked on code view", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("button", { name: "BACK" }));

    expect(mockGoToBrowse).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls goToCode when Back is clicked on results view", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "results",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("button", { name: "BACK" }));

    expect(mockGoToCode).toHaveBeenCalledTimes(1);
    expect(mockGoToBrowse).not.toHaveBeenCalled();
  });

  it("disables Forward when on browse without project slug", () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "browse",
      hasProjectSlug: false,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    const forwardButton = screen.getByRole("button", { name: "FORWARD" });
    expect(forwardButton).toBeDisabled();
  });

  it("disables Forward when on code without results", () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    const forwardButton = screen.getByRole("button", { name: "FORWARD" });
    expect(forwardButton).toBeDisabled();
  });

  it("calls goToCode when Forward is clicked on browse with project slug", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "browse",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("button", { name: "FORWARD" }));

    expect(mockGoToCode).toHaveBeenCalledTimes(1);
  });

  it("calls goToResults when Forward is clicked on code with results", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />, { hasResults: true });

    await userEvent.click(screen.getByRole("button", { name: "FORWARD" }));

    expect(mockGoToResults).toHaveBeenCalledTimes(1);
  });
});
