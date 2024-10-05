import { Stack, Typography } from "@mui/material";

import { useAppSelector } from "#/store/hooks";
import { selectBenchmarkResults } from "#/store/reducers/callstackReducer";

import { BenchmarkChart } from "./BenchmarkChart";

export const BenchmarkView = () => {
  const benchmarkResults = useAppSelector(selectBenchmarkResults);

  return (
    <>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Typography variant="body2">
          <strong>Average: </strong>
          {benchmarkResults?.averageTime} ms
        </Typography>
        <Typography variant="body2">
          <strong>Median: </strong>
          {benchmarkResults?.medianTime} ms
        </Typography>
        <Typography variant="body2">
          <strong>P75: </strong>
          {benchmarkResults?.p75Time} ms
        </Typography>
        <Typography variant="body2">
          <strong>P90: </strong>
          {benchmarkResults?.p90Time} ms
        </Typography>
        <Typography variant="body2">
          <strong>P99: </strong>
          {benchmarkResults?.p99Time} ms
        </Typography>
      </Stack>
      <BenchmarkChart />
    </>
  );
};
