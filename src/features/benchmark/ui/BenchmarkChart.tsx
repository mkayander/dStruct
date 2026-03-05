import { Box, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useMemo } from "react";

import { selectRuntimeData } from "#/features/callstack/model/callstackSlice";
import { useAppSelector } from "#/store/hooks";

export const BenchmarkChart: React.FC = () => {
  const theme = useTheme();
  const { benchmarkResults } = useAppSelector(selectRuntimeData);

  const sortedRuntimes = useMemo(
    () => benchmarkResults?.results?.toSorted((a, b) => a - b),
    [benchmarkResults?.results],
  );

  const xAxisData = useMemo(
    () => benchmarkResults?.results?.map((_, i) => i) ?? [],
    [benchmarkResults?.results],
  );

  if (!benchmarkResults?.results) {
    return <Typography>No data</Typography>;
  }

  const commonAxisConfig = {
    xAxis: [
      {
        data: xAxisData,
        scaleType: "point" as const,
        label: "Iteration",
      },
    ],
    yAxis: [{ label: "Runtime (ms)" }],
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle2" sx={{ alignSelf: "flex-start", mb: 1 }}>
        Runtime by execution order
      </Typography>
      <LineChart
        series={[
          {
            data: benchmarkResults.results,
            showMark: false,
            area: true,
            connectNulls: true,
            valueFormatter: (v) => v?.toFixed(24) ?? "",
            color: theme.palette.primary.light,
          },
        ]}
        xAxis={commonAxisConfig.xAxis}
        yAxis={commonAxisConfig.yAxis}
        desc="Benchmark chart"
        height={300}
        sx={{
          width: "100%",
        }}
      />
      <Typography
        variant="subtitle2"
        sx={{ alignSelf: "flex-start", mb: 1, mt: 2 }}
      >
        Runtime distribution (sorted)
      </Typography>
      <LineChart
        series={[
          {
            data: sortedRuntimes ?? [],
            showMark: false,
            area: true,
            connectNulls: true,
            valueFormatter: (v) => v?.toFixed(24) ?? "",
            color: theme.palette.secondary.light,
          },
        ]}
        xAxis={[
          {
            data: (sortedRuntimes ?? []).map((_, i) => i),
            scaleType: "point" as const,
            label: "Sample index",
          },
        ]}
        yAxis={commonAxisConfig.yAxis}
        desc="Benchmark chart"
        height={300}
        sx={{
          width: "100%",
        }}
      />
    </Box>
  );
};
