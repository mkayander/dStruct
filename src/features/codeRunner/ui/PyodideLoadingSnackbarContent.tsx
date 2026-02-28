import { Box, LinearProgress, Typography } from "@mui/material";

import { useAppSelector } from "#/store/hooks";

/**
 * Snackbar body that shows live Pyodide load progress from Redux state
 * (updated by the worker PROGRESS messages via pyodideSlice).
 */
export const PyodideLoadingSnackbarContent: React.FC = () => {
  const progress = useAppSelector((state) => state.pyodide.progress) ?? {
    value: 0,
    stage: "",
  };

  return (
    <Box sx={{ minWidth: 220 }}>
      <Typography variant="body2">Loading Pyodide: {progress.stage}</Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, Math.max(0, progress.value))}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};
