/** Mutable execution source position for the in-worker JS runtime (line = 1-based editor line). */
export type ExecutionSourceSnapshot = {
  line: number;
  column?: number;
};

const state: { line: number | null; column: number | null } = {
  line: null,
  column: null,
};

export const clearExecutionSource = (): void => {
  state.line = null;
  state.column = null;
};

export const setExecutionSource = (line: number, column?: number | null): void => {
  state.line = line;
  state.column = column ?? null;
};

export const peekExecutionSourceForFrame = ():
  | ExecutionSourceSnapshot
  | undefined => {
  if (state.line == null) return undefined;
  const snap: ExecutionSourceSnapshot = { line: state.line };
  if (state.column != null) snap.column = state.column;
  return snap;
};
