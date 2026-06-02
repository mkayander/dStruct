import { useEffect } from "react";

import { editorSlice } from "#/features/treeViewer/model/editorSlice";
import { useAppDispatch } from "#/store/hooks";

/**
 * Landing hero preview: keep tree layout CSS transitions unless the user has
 * prefers-reduced-motion: reduce.
 */
export const useLandingHeroPreviewLayoutTransitions = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncLayoutTransitions = () => {
      dispatch(
        editorSlice.actions.setDisableLayoutTransitions(mediaQuery.matches),
      );
    };

    syncLayoutTransitions();
    mediaQuery.addEventListener("change", syncLayoutTransitions);

    return () => {
      mediaQuery.removeEventListener("change", syncLayoutTransitions);
    };
  }, [dispatch]);
};
