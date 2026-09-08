import { Box, Container, Skeleton } from "@mui/material";
import React from "react";

/** Instant-nav fallback for `/daily` while the page shell and data stream in. */
export const DailyPageSkeleton: React.FC = () => (
  <Box component="main" sx={{ minHeight: "85vh", py: 8 }}>
    <Container maxWidth="lg">
      <Skeleton
        variant="text"
        width="60%"
        height={48}
        animation="wave"
        sx={{ mx: "auto", mb: 4 }}
      />
      <Skeleton
        variant="rounded"
        height={320}
        animation="wave"
        sx={{ borderRadius: 2 }}
      />
    </Container>
  </Box>
);
