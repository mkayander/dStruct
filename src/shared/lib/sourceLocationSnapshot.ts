/** User/editor coordinates: line is 1-based; column is 0-based when present. */
export type SourceLocationSnapshot = {
  line: number;
  column?: number;
};
