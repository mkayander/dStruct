import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

// Fixed height to match ProjectBrowserItem
const ITEM_HEIGHT = 76;

export const ProjectBrowserItemSkeleton: React.FC = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1.5}
      sx={{
        height: ITEM_HEIGHT,
        p: 1.75,
        px: 2,
        borderRadius: 1.5,
      }}
    >
      {/* Left side: Completion status placeholder, title, category */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flex={1}
        minWidth={0}
      >
        {/* Completion status placeholder */}
        <Box
          sx={{
            width: 20,
            height: 20,
            flexShrink: 0,
          }}
        />

        <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="nowrap"
          >
            {/* Title skeleton */}
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{
                fontSize: "0.95rem",
              }}
            />
            {/* Category chip skeleton */}
            <Skeleton
              variant="rectangular"
              width={80}
              height={22}
              sx={{
                borderRadius: 1,
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Right side: Difficulty chip, avatar, "new" label */}
      <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
        {/* Difficulty chip skeleton */}
        <Skeleton
          variant="rectangular"
          width={60}
          height={24}
          sx={{
            borderRadius: 1.5,
          }}
        />
        {/* Avatar skeleton */}
        <Skeleton variant="circular" width={32} height={32} />
        {/* "New" label skeleton */}
        <Skeleton
          variant="rectangular"
          width={40}
          height={18}
          sx={{
            borderRadius: 0.75,
          }}
        />
      </Stack>
    </Stack>
  );
};
