import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";

import { useAppSelector } from "#/store/hooks";

import { PyodideLoadingSnackbarContent } from "../ui/PyodideLoadingSnackbarContent";

const PYODIDE_LOADING_SNACKBAR_KEY = "pyodide-loading";

const PYTHON_EXEC_MODE = process.env.NEXT_PUBLIC_PYTHON_EXEC_MODE ?? "pyodide";

/**
 * Single source of truth for the Pyodide loading snackbar.
 * Call near the Python code runner; shows snackbar when progress is non-null, hides when null.
 */
export function usePyodideProgressSnackbar(): void {
  const progress = useAppSelector((state) => state.pyodide.progress);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const hasSnackbarShownRef = useRef(false);

  useEffect(() => {
    if (PYTHON_EXEC_MODE !== "pyodide") return;

    if (progress !== null) {
      if (!hasSnackbarShownRef.current) {
        hasSnackbarShownRef.current = true;
        enqueueSnackbar(<PyodideLoadingSnackbarContent />, {
          variant: "info",
          persist: true,
          key: PYODIDE_LOADING_SNACKBAR_KEY,
        });
      }
    } else {
      if (hasSnackbarShownRef.current) {
        hasSnackbarShownRef.current = false;
        closeSnackbar(PYODIDE_LOADING_SNACKBAR_KEY);
      }
    }
  }, [progress, enqueueSnackbar, closeSnackbar]);
}
