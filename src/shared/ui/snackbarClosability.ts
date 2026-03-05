import type { SnackbarKey } from "notistack";

const NON_CLOSABLE_SNACKBAR_KEYS: readonly SnackbarKey[] = [
  "benchmark-progress",
  "pyodide-loading",
];

export function isSnackbarClosable(key: SnackbarKey): boolean {
  return !NON_CLOSABLE_SNACKBAR_KEYS.includes(key);
}
