import { fallbackProxy } from "#/context/I18nContext";

/**
 * Returns a mock implementation of useI18nContext that uses fallbackProxy for LL.
 * Use in vi.mock("#/shared/hooks", ...) to avoid wrapping components in I18nProvider.
 *
 * Must be imported dynamically inside the mock factory (vi.mock is hoisted):
 *
 * @example
 * vi.mock("#/shared/hooks", async (importOriginal) => {
 *   const { mockUseI18nContext } = await import("#/shared/testUtils");
 *   const actual = await importOriginal<typeof import("#/shared/hooks")>();
 *   return {
 *     ...actual,
 *     useI18nContext: mockUseI18nContext,
 *   };
 * });
 */
export const mockUseI18nContext = () => ({ LL: fallbackProxy });
