import { Box, Stack, Typography, useTheme } from "@mui/material";

import { selectBenchmarkResults } from "#/features/callstack/model/callstackSlice";
import { useAppSelector } from "#/store/hooks";

import { BenchmarkChart } from "./BenchmarkChart";

const StatChip: React.FC<{
  label: string;
  value: number | undefined;
}> = ({ label, value }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 0.5,
        px: 1.25,
        py: 0.5,
        borderRadius: 1,
        backgroundColor: theme.palette.action.hover,
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight={600}>
        {value != null ? `${value.toFixed(2)} ms` : "—"}
      </Typography>
    </Box>
  );
};

export const BenchmarkView = () => {
  const benchmarkResults = useAppSelector(selectBenchmarkResults);

  return (
    <Stack
      spacing={{
        xs: 1,
        md: 2,
      }}
    >
      <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
        <StatChip label="Avg" value={benchmarkResults?.averageTime} />
        <StatChip label="Med" value={benchmarkResults?.medianTime} />
        <StatChip label="P75" value={benchmarkResults?.p75Time} />
        <StatChip label="P90" value={benchmarkResults?.p90Time} />
        <StatChip label="P95" value={benchmarkResults?.p95Time} />
        <StatChip label="P99" value={benchmarkResults?.p99Time} />
      </Stack>
      <BenchmarkChart />
    </Stack>
  );
};
