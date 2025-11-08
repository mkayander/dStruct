import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectCurrentPage,
  selectHasMore,
  selectPageSize,
} from "../model/projectBrowserSlice";

/**
 * Hook for managing project pagination
 */
export const useProjectPagination = () => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  const hasMore = useAppSelector(selectHasMore);

  const setCurrentPage = (page: number) => {
    dispatch(projectBrowserSlice.actions.setCurrentPage(page));
  };

  const setHasMore = (hasMoreData: boolean) => {
    dispatch(projectBrowserSlice.actions.setHasMore(hasMoreData));
  };

  const loadNextPage = () => {
    if (hasMore) {
      dispatch(projectBrowserSlice.actions.setCurrentPage(currentPage + 1));
    }
  };

  return {
    currentPage,
    pageSize,
    hasMore,
    setCurrentPage,
    setHasMore,
    loadNextPage,
  };
};
