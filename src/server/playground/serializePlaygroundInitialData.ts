import type { PlaygroundInitialData } from "#/server/playground/getPlaygroundInitialData";

/**
 * Strip non-serializable values (Dates, cache metadata symbols) before passing
 * playground prefetch props to a Client Component boundary.
 */
export function serializePlaygroundInitialData(
  initialData: PlaygroundInitialData,
): PlaygroundInitialData {
  return JSON.parse(JSON.stringify(initialData)) as PlaygroundInitialData;
}
