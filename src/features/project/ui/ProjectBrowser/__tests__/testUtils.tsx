import { vi } from "vitest";

/**
 * Shared test utilities and mocks for ProjectBrowser tests.
 * Follows DRY principles by centralizing common mocks.
 *
 * IMPORTANT: vi.mock() calls must be at the top level of test files, not in functions.
 * Import this file and call setupUseSearchParamMock() and setupRouterMock() at the top level.
 */

// Mock setters for useSearchParam
export const mockSetBrowserParam = vi.fn();
export const mockSetSearchParam = vi.fn();
export const mockSetCategoriesParam = vi.fn();
export const mockSetDifficultiesParam = vi.fn();
export const mockSetNewParam = vi.fn();
export const mockSetSortParam = vi.fn();

/**
 * Default implementation of mockUseSearchParam that returns empty values for all params.
 */
export const createDefaultMockUseSearchParam = () => {
  return vi.fn((param: string) => {
    switch (param) {
      case "browser":
        return ["", mockSetBrowserParam];
      case "search":
        return ["", mockSetSearchParam];
      case "categories":
        return ["", mockSetCategoriesParam];
      case "difficulties":
        return ["", mockSetDifficultiesParam];
      case "new":
        return ["", mockSetNewParam];
      case "sort":
        return ["", mockSetSortParam];
      default:
        return ["", vi.fn()];
    }
  });
};

/**
 * Mock implementation of useSearchParam hook.
 * Can be customized per test by calling mockUseSearchParam.mockImplementation().
 */
export const mockUseSearchParam = createDefaultMockUseSearchParam();

/**
 * Mock factory for useSearchParam hook.
 * Use this in vi.mock() calls at the top level of test files.
 *
 * @example
 * vi.mock("#/shared/hooks", () => ({
 *   useSearchParam: (param: string) => mockUseSearchParam(param),
 * }));
 */
export const createUseSearchParamMock = () => (param: string) =>
  mockUseSearchParam(param);

/**
 * Mock factory for Next.js router.
 * Use this in vi.mock() calls at the top level of test files.
 *
 * @example
 * vi.mock("next/router", () => ({
 *   useRouter: vi.fn(() => ({
 *     pathname: "/",
 *     query: {},
 *     push: vi.fn(),
 *   })),
 * }));
 */
export const createRouterMock = () => ({
  useRouter: vi.fn(() => ({
    pathname: "/",
    query: {},
    push: vi.fn(),
  })),
});

/**
 * Resets all mock functions to their default state.
 * Call this in beforeEach hooks to reset mocks between tests.
 */
export const resetAllMocks = () => {
  vi.clearAllMocks();
  mockSetBrowserParam.mockClear();
  mockSetSearchParam.mockClear();
  mockSetCategoriesParam.mockClear();
  mockSetDifficultiesParam.mockClear();
  mockSetNewParam.mockClear();
  mockSetSortParam.mockClear();
  mockUseSearchParam.mockImplementation(createDefaultMockUseSearchParam());
};
