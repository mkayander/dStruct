import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectFilters,
} from "../model/projectBrowserSlice";

/**
 * Hook for managing project filters
 */
export const useProjectFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const setSearchQuery = (query: string) => {
    dispatch(projectBrowserSlice.actions.setSearchQuery(query));
  };

  const setSelectedCategories = (
    categories: typeof filters.selectedCategories,
  ) => {
    dispatch(projectBrowserSlice.actions.setSelectedCategories(categories));
  };

  const setSelectedDifficulties = (
    difficulties: typeof filters.selectedDifficulties,
  ) => {
    dispatch(projectBrowserSlice.actions.setSelectedDifficulties(difficulties));
  };

  const setShowOnlyNew = (show: boolean) => {
    dispatch(projectBrowserSlice.actions.setShowOnlyNew(show));
  };

  const setShowOnlyMine = (show: boolean) => {
    dispatch(projectBrowserSlice.actions.setShowOnlyMine(show));
  };

  const resetFilters = () => {
    dispatch(projectBrowserSlice.actions.resetFilters());
  };

  return {
    filters,
    setSearchQuery,
    setSelectedCategories,
    setSelectedDifficulties,
    setShowOnlyNew,
    setShowOnlyMine,
    resetFilters,
  };
};
