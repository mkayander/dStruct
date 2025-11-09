import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as ReduxProvider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { I18nContext } from "#/context";
import en from "#/i18n/en/index";
import { makeStore } from "#/store/makeStore";
import { theme } from "#/themes";

import {
  projectBrowserSlice,
  selectSelectedDifficulties,
  selectShowOnlyNew,
} from "../../../model/projectBrowserSlice";
import { ProjectBrowserFilters } from "../ProjectBrowserFilters";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
}));

// Create mock i18n context value
const createMockI18n = () => {
  const LL = {} as Record<string, () => string>;
  // Add all translation functions
  Object.keys(en).forEach((key: string) => {
    // @ts-expect-error - key is a string
    LL[key] = () => en[key];
  });

  return {
    LL: LL as any,
  };
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = makeStore();
  const i18nValue = createMockI18n();
  return render(
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <I18nContext.Provider value={i18nValue}>{ui}</I18nContext.Provider>
      </ThemeProvider>
    </ReduxProvider>,
  );
};

describe("ProjectBrowserFilters", () => {
  const mockOnClose = vi.fn();
  const mockAnchorEl = document.createElement("button");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render filters panel when open", () => {
    renderWithProviders(
      <ProjectBrowserFilters
        anchorEl={mockAnchorEl}
        open={true}
        onClose={mockOnClose}
      />,
    );

    // Check for "Filters" text (translated)
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    renderWithProviders(
      <ProjectBrowserFilters
        anchorEl={mockAnchorEl}
        open={false}
        onClose={mockOnClose}
      />,
    );

    expect(screen.queryByText("Filters")).not.toBeInTheDocument();
  });

  it("should render difficulty toggle buttons", () => {
    renderWithProviders(
      <ProjectBrowserFilters
        anchorEl={mockAnchorEl}
        open={true}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("should toggle difficulty when clicked", async () => {
    const user = userEvent.setup();
    const store = makeStore();

    const i18nValue = createMockI18n();
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <I18nContext.Provider value={i18nValue}>
            <ProjectBrowserFilters
              anchorEl={mockAnchorEl}
              open={true}
              onClose={mockOnClose}
            />
          </I18nContext.Provider>
        </ThemeProvider>
      </ReduxProvider>,
    );

    const easyButton = screen.getByText("Easy");
    await user.click(easyButton);

    const state = store.getState();
    const selectedDifficulties = selectSelectedDifficulties(state);
    expect(selectedDifficulties).toContain("EASY");
  });

  it("should toggle show only new checkbox", async () => {
    const user = userEvent.setup();
    const store = makeStore();

    const i18nValue = createMockI18n();
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <I18nContext.Provider value={i18nValue}>
            <ProjectBrowserFilters
              anchorEl={mockAnchorEl}
              open={true}
              onClose={mockOnClose}
            />
          </I18nContext.Provider>
        </ThemeProvider>
      </ReduxProvider>,
    );

    const checkbox = screen.getByLabelText("Show only new projects");
    await user.click(checkbox);

    const state = store.getState();
    const showOnlyNew = selectShowOnlyNew(state);
    expect(showOnlyNew).toBe(true);
  });

  it("should show clear all filters button when filters are active", () => {
    const store = makeStore();
    store.dispatch(
      projectBrowserSlice.actions.setSelectedDifficulties(["EASY"]),
    );

    const i18nValue = createMockI18n();
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <I18nContext.Provider value={i18nValue}>
            <ProjectBrowserFilters
              anchorEl={mockAnchorEl}
              open={true}
              onClose={mockOnClose}
            />
          </I18nContext.Provider>
        </ThemeProvider>
      </ReduxProvider>,
    );

    expect(screen.getByText("Clear all filters")).toBeInTheDocument();
  });

  it("should not show clear all filters button when no filters are active", () => {
    renderWithProviders(
      <ProjectBrowserFilters
        anchorEl={mockAnchorEl}
        open={true}
        onClose={mockOnClose}
      />,
    );

    expect(screen.queryByText("Clear all filters")).not.toBeInTheDocument();
  });

  it("should clear all filters when clear button is clicked", async () => {
    const user = userEvent.setup();
    const store = makeStore();
    store.dispatch(
      projectBrowserSlice.actions.setSelectedDifficulties(["EASY", "MEDIUM"]),
    );
    store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(true));

    const i18nValue = createMockI18n();
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={theme}>
          <I18nContext.Provider value={i18nValue}>
            <ProjectBrowserFilters
              anchorEl={mockAnchorEl}
              open={true}
              onClose={mockOnClose}
            />
          </I18nContext.Provider>
        </ThemeProvider>
      </ReduxProvider>,
    );

    const clearButton = screen.getByText("Clear all filters");
    await user.click(clearButton);

    const state = store.getState();
    expect(selectSelectedDifficulties(state)).toEqual([]);
    expect(selectShowOnlyNew(state)).toBe(false);
  });

  it("should call onClose when close button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ProjectBrowserFilters
        anchorEl={mockAnchorEl}
        open={true}
        onClose={mockOnClose}
      />,
    );

    const closeButton = screen.getByLabelText(/close filters/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
