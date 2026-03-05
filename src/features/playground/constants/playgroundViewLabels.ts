import type { PlaygroundView } from "../hooks/usePlaygroundViewParam";

/** i18n keys for playground phase labels (BROWSE, CODE, RESULTS). */
export const VIEW_LABEL_KEYS: Record<
  PlaygroundView,
  "BROWSE" | "CODE" | "RESULTS"
> = {
  browse: "BROWSE",
  code: "CODE",
  results: "RESULTS",
};
