import { useSearchParam } from "#/shared/hooks";

const PLAYGROUND_VIEWS = ["browse", "code", "results"] as const;
export type PlaygroundView = (typeof PLAYGROUND_VIEWS)[number];

export const isPlaygroundView = (value: unknown): value is PlaygroundView =>
  typeof value === "string" &&
  PLAYGROUND_VIEWS.includes(value as PlaygroundView);

export const usePlaygroundViewParam = () => {
  const [view, setView] = useSearchParam<PlaygroundView>("view");

  return { view, setView } as const;
};
