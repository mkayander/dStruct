import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";

import { useAppSelector } from "#/store/hooks";

import { BenchmarkProgressSnackbarContent } from "../ui/BenchmarkProgressSnackbarContent";

const BENCHMARK_PROGRESS_SNACKBAR_KEY = "benchmark-progress";

/**
 * Single source of truth for the benchmark progress snackbar.
 * Call near the JS code runner; shows snackbar when progress is non-null, hides when null.
 */
export function useBenchmarkProgressSnackbar(): void {
  const progress = useAppSelector((state) => state.benchmark.progress);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const hasSnackbarShownRef = useRef(false);

  useEffect(() => {
    if (progress !== null) {
      if (!hasSnackbarShownRef.current) {
        hasSnackbarShownRef.current = true;
        enqueueSnackbar(<BenchmarkProgressSnackbarContent />, {
          variant: "success",
          hideIconVariant: true,
          persist: true,
          key: BENCHMARK_PROGRESS_SNACKBAR_KEY,
        });
      }
    } else {
      if (hasSnackbarShownRef.current) {
        hasSnackbarShownRef.current = false;
        closeSnackbar(BENCHMARK_PROGRESS_SNACKBAR_KEY);
      }
    }
  }, [progress, enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    return () => {
      if (hasSnackbarShownRef.current) {
        closeSnackbar(BENCHMARK_PROGRESS_SNACKBAR_KEY);
      }
    };
  }, [closeSnackbar]);
}
