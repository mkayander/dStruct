import { useEffect } from "react";

import { editorSlice } from "#/features/treeViewer/model/editorSlice";
import { useMobileLayout } from "#/shared/hooks";
import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { useAppDispatch } from "#/store/hooks";

/**
 * Landing hero preview: keep tree layout transitions on desktop, disable on mobile
 * and when the user prefers reduced motion (helps older / lower-end devices).
 */
export const useLandingHeroPreviewLayoutTransitions = (): void => {
  const dispatch = useAppDispatch();
  const isMobileLayout = useMobileLayout();

  useEffect(() => {
    const disableLayoutTransitions = isMobileLayout || prefersReducedMotion();
    dispatch(
      editorSlice.actions.setDisableLayoutTransitions(disableLayoutTransitions),
    );
  }, [dispatch, isMobileLayout]);
};
