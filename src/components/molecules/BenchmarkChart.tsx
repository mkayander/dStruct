import { Box, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import React, { useMemo } from "react";

import { useAppSelector } from "#/store/hooks";
import { selectRuntimeData } from "#/store/reducers/callstackReducer";

export const BenchmarkChart: React.FC = () => {
  const theme = useTheme();
  const { benchmarkResults } = useAppSelector(selectRuntimeData);

  const sortedRuntimes = useMemo(
    () => benchmarkResults?.results?.toSorted((a, b) => a - b),
    [benchmarkResults?.results],
  );

  if (!benchmarkResults?.results) {
    return <Typography>No data</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
        desc="Benchmark chart"
        height={300}
      />
      <LineChart
        series={[
          {
            data: sortedRuntimes,
            showMark: false,
            area: true,
            connectNulls: true,
            valueFormatter: (v) => v?.toFixed(24) ?? "",
            color: theme.palette.secondary.light,
          },
        ]}
        desc="Benchmark chart"
        height={300}
      />
    </Box>
  );
};
