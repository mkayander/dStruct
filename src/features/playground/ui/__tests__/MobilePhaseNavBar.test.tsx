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

const mockGoToBrowse = vi.fn();
const mockGoToCode = vi.fn();
const mockGoToResults = vi.fn();

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

  it("disables Code tab when there is no project slug", () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "browse",
      hasProjectSlug: false,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    expect(screen.getByRole("tab", { name: "CODE" })).toBeDisabled();
  });

  it("disables Results tab when callstack is not ready", () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    expect(screen.getByRole("tab", { name: "RESULTS" })).toBeDisabled();
  });

  it("calls goToBrowse when Browse tab is selected from code view", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("tab", { name: "BROWSE" }));

    expect(mockGoToBrowse).toHaveBeenCalledTimes(1);
    expect(mockGoToCode).not.toHaveBeenCalled();
    expect(mockGoToResults).not.toHaveBeenCalled();
  });

  it("calls goToCode when Code tab is selected from browse with project slug", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "browse",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />);

    await userEvent.click(screen.getByRole("tab", { name: "CODE" }));

    expect(mockGoToCode).toHaveBeenCalledTimes(1);
  });

  it("calls goToResults when Results tab is selected with results ready", async () => {
    useMobilePlaygroundView.mockReturnValue({
      currentView: "code",
      hasProjectSlug: true,
      goToBrowse: mockGoToBrowse,
      goToCode: mockGoToCode,
      goToResults: mockGoToResults,
    });

    renderWithProviders(<MobilePhaseNavBar />, { hasResults: true });

    await userEvent.click(screen.getByRole("tab", { name: "RESULTS" }));

    expect(mockGoToResults).toHaveBeenCalledTimes(1);
  });
});
