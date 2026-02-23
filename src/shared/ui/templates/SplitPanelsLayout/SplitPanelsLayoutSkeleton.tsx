import { Box, Container, Skeleton, Stack } from "@mui/material";
import React from "react";

import { useMobileLayout } from "#/shared/hooks/useMobileLayout";

function PanelSkeleton({ flex }: { flex: string }) {
  return (
    <Skeleton
      variant="rectangular"
      animation="wave"
      sx={{ flex, borderRadius: 2, cursor: "wait" }}
    />
  );
}

function ListPanelSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      animation="wave"
      sx={{ width: "100%", height: 200, borderRadius: 1, cursor: "wait" }}
    />
  );
}

function SkeletonColumn({
  flex,
  topFlex,
  bottomFlex,
}: {
  flex: string;
  topFlex: string;
  bottomFlex: string;
}) {
  return (
    <Box
      sx={{
        flex,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <PanelSkeleton flex={topFlex} />
      <PanelSkeleton flex={bottomFlex} />
    </Box>
  );
}

/**
 * Desktop: two-column split (project+code | structure+output).
 * Mobile: simple list of four panels, matching Wrapper mobile layout.
 */
export const SplitPanelsLayoutSkeleton: React.FC = () => {
  const isMobile = useMobileLayout();

  if (isMobile)
    return (
      <Container component="main" sx={{ pb: 4 }}>
        <Stack spacing={1} mt={1} pb={4}>
          <ListPanelSkeleton />
          <ListPanelSkeleton />
          <ListPanelSkeleton />
          <ListPanelSkeleton />
        </Stack>
      </Container>
    );

  return (
    <Box
      component="main"
      sx={{
        height: "calc(100vh - 57px)",
        width: "100vw",
        px: 1,
        pb: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        gap: 1.5,
      }}
    >
      <SkeletonColumn flex="0 0 60%" topFlex="0 0 15%" bottomFlex="1 1 30%" />
      <SkeletonColumn flex="1 1 40%" topFlex="1 1 80%" bottomFlex="0 0 30%" />
    </Box>
  );
};
