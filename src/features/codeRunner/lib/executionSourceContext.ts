import type { SourceLocationSnapshot } from "#/shared/lib/sourceLocationSnapshot";

const state: { line: number | null; column: number | null } = {
  line: null,
  column: null,
};

export const clearExecutionSource = (): void => {
  state.line = null;
  state.column = null;
};

export const setExecutionSource = (
  line: number,
  column?: number | null,
): void => {
  state.line = line;
  state.column = column ?? null;
};

export const peekExecutionSourceForFrame = ():
  | SourceLocationSnapshot
  | undefined => {
  if (state.line == null) return undefined;
  const snap: SourceLocationSnapshot = { line: state.line };
  if (state.column != null) snap.column = state.column;
  return snap;
};
