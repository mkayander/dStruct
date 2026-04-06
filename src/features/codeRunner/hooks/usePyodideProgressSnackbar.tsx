import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";

import { useAppSelector } from "#/store/hooks";

import { PyodideLoadingSnackbarContent } from "../ui/PyodideLoadingSnackbarContent";

const PYODIDE_LOADING_SNACKBAR_KEY = "pyodide-loading";

/**
 * Single source of truth for the Pyodide loading snackbar.
 * Call near the Python code runner; shows snackbar when progress is non-null, hides when null.
 */
export function usePyodideProgressSnackbar(): void {
  const progress = useAppSelector((state) => state.pyodide.progress);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const hasSnackbarShownRef = useRef(false);

  // Show snackbar when progress is non-null; hide when null. Single source of truth for this snackbar.
  useEffect(() => {
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

  // Cleanup: close snackbar on unmount so it does not persist across navigation.
  useEffect(() => {
    return () => {
      if (hasSnackbarShownRef.current) {
        closeSnackbar(PYODIDE_LOADING_SNACKBAR_KEY);
      }
    };
  }, [closeSnackbar]);
}
