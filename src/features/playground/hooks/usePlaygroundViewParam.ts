import { useSearchParam } from "#/shared/hooks";

import { usePlaygroundViewContext } from "../context/PlaygroundViewContext";
import {
  PLAYGROUND_VIEW_PARAM_OPTIONS,
  type PlaygroundView,
  type PlaygroundViewParam,
} from "../model/playgroundView";

export type { PlaygroundView } from "../model/playgroundView";
export { isPlaygroundView } from "../model/playgroundView";

/**
 * Returns the playground view param. When inside PlaygroundViewProvider,
 * updates are instant (shared React state). Otherwise falls back to useSearchParam
 * (syncs via router, so updates may lag until router propagates).
 */
export const usePlaygroundViewParam = (): PlaygroundViewParam => {
  const context = usePlaygroundViewContext();
  const [view, setView] = useSearchParam<PlaygroundView | "">(
    "view",
    PLAYGROUND_VIEW_PARAM_OPTIONS,
  );
  return context ?? { view, setView };
};
