import { useProjectBrowserContext } from "../ui/ProjectBrowser/ProjectBrowserContext";

/**
 * Hook for managing project filters.
 * @deprecated This hook is deprecated. Use `useProjectBrowserContext` directly instead.
 * This hook is kept for backward compatibility but now delegates to ProjectBrowserContext.
 */
export const useProjectFilters = () => {
  const context = useProjectBrowserContext();

  return {
    filters: {
      searchQuery: context.searchQuery,
      selectedCategories: context.selectedCategories,
      selectedDifficulties: context.selectedDifficulties,
      showOnlyNew: context.showOnlyNew,
      showOnlyMine: false, // showOnlyMine is not available in URL state
    },
    setSearchQuery: context.setSearchQuery,
    setSelectedCategories: context.setSelectedCategories,
    setSelectedDifficulties: context.setSelectedDifficulties,
    setShowOnlyNew: context.setShowOnlyNew,
    setShowOnlyMine: () => {
      // No-op: showOnlyMine is not available in URL state
      console.warn(
        "setShowOnlyMine is not supported. Use ProjectBrowserContext directly for filter management.",
      );
    },
    resetFilters: context.resetFilters,
  };
};
