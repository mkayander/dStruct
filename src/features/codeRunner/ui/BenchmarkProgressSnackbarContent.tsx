import { Box, LinearProgress, Typography } from "@mui/material";

import { useAppSelector } from "#/store/hooks";

/**
 * Snackbar body that shows live benchmark progress from Redux state
 * (updated by the worker benchmark-progress messages via benchmarkSlice).
 */
export const BenchmarkProgressSnackbarContent: React.FC = () => {
  const progress = useAppSelector((state) => state.benchmark.progress) ?? {
    current: 0,
    total: 1,
  };
  const value =
    progress.total > 0
      ? Math.min(100, Math.max(0, (progress.current / progress.total) * 100))
      : 0;

  return (
    <Box sx={{ minWidth: 220 }}>
      <Typography variant="body2">
        Benchmark: {progress.current} / {progress.total} iterations
      </Typography>
      <LinearProgress
        variant="determinate"
        color="success"
        value={value}
        sx={{
          mt: 1,
          "& .MuiLinearProgress-bar": {
            transition: "none",
          },
        }}
      />
    </Box>
  );
};
