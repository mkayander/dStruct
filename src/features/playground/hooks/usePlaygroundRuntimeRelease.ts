import { useEffect } from "react";

import { pythonRunner } from "#/features/codeRunner/lib/pythonRunner";

/** Release Pyodide when playground hides or unmounts (Activity / cacheComponents). */
export const usePlaygroundRuntimeRelease = (): void => {
  useEffect(() => () => pythonRunner.release(), []);
};
