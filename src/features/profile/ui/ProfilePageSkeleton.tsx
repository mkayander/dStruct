import { Box, Container, Grid, Skeleton } from "@mui/material";
import React from "react";

/** Instant-nav fallback while profile client view hydrates (P10). Server-safe — no MainLayout/Footer. */
export const ProfilePageSkeleton: React.FC = () => (
  <Box
    component="main"
    data-testid="profile-page-skeleton"
    sx={{ minHeight: "85vh" }}
  >
    <Container>
      <Box sx={{ mb: 8, display: "flex", justifyContent: "center" }}>
        <Skeleton variant="rounded" width={280} height={48} animation="wave" />
      </Box>
      <Skeleton
        variant="text"
        width="40%"
        height={40}
        animation="wave"
        sx={{ mb: 3 }}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rounded"
            height={320}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton
            variant="rounded"
            height={320}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);
