import { useLayoutEffect } from "react";

import { pythonRunner } from "#/features/codeRunner/lib/pythonRunner";

/** Release Pyodide when playground hides or unmounts (Activity / cacheComponents). */
export const usePlaygroundRuntimeRelease = (): void => {
  useLayoutEffect(() => () => pythonRunner.release(), []);
};
