import { Grid, Skeleton } from "@mui/material";
import React from "react";

/** Fallback while LeetCode daily data streams in below the server-rendered title. */
export const DailyInteractiveSkeleton: React.FC = () => (
  <Grid
    container
    spacing={4}
    sx={{
      justifyContent: "center",
    }}
  >
    <Grid size={{ xs: 12, lg: 8 }}>
      <Skeleton
        variant="rounded"
        height={200}
        animation="wave"
        sx={{ mb: 4, borderRadius: 2 }}
      />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <Skeleton
        variant="rounded"
        height={320}
        animation="wave"
        sx={{ borderRadius: 2 }}
      />
    </Grid>
  </Grid>
);
