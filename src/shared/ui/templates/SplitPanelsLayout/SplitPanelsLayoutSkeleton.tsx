import { Box, Skeleton } from "@mui/material";
import React from "react";

function PanelSkeleton({ flex }: { flex: string }) {
  return (
    <Skeleton
      variant="rectangular"
      animation="wave"
      sx={{ flex, borderRadius: 2, cursor: "wait" }}
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
 * Desktop-only skeleton shown while the split layout hydrates.
 * Mobile uses `MobilePlayground` directly and does not need this skeleton.
 */
export const SplitPanelsLayoutSkeleton: React.FC = () => {
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
