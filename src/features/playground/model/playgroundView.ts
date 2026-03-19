import type { SearchParamOptions } from "#/shared/hooks/useSearchParam";

export const PLAYGROUND_VIEWS = ["browse", "code", "results"] as const;
export type PlaygroundView = (typeof PLAYGROUND_VIEWS)[number];

export const isPlaygroundView = (value: unknown): value is PlaygroundView =>
  typeof value === "string" &&
  PLAYGROUND_VIEWS.includes(value as PlaygroundView);

export const PLAYGROUND_VIEW_PARAM_OPTIONS: SearchParamOptions<
  PlaygroundView | ""
> = {
  defaultValue: "",
  validate: (v): v is PlaygroundView | "" => v === "" || isPlaygroundView(v),
};

export type PlaygroundViewParam = {
  view: PlaygroundView | "";
  setView: (
    value: PlaygroundView | "",
    options?: { replace?: boolean; pathName?: string },
  ) => void;
};
