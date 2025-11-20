import { Skeleton } from "@mui/material";
import React from "react";

import { selectIsInitialized } from "#/features/project/model/projectSlice";
import { useAppSelector } from "#/store/hooks";

export const LoadingSkeletonOverlay: React.FC = () => {
  const isInitialized = useAppSelector(selectIsInitialized);
  if (isInitialized) return null;

  return (
    <Skeleton
      animation="wave"
      variant="rectangular"
      sx={{
        position: "absolute",
        background: "#0000",
        animation: "pulse 2s infinite ease-in-out",
        height: "100%",
        width: "100%",
        borderRadius: 2,
        top: 0,
        left: 0,
        zIndex: 10,
        cursor: "wait",

        "@keyframes pulse": {
          "0%": {
            background: "#fff0",
          },
          "50%": {
            background: "#fff1",
          },
          "100%": {
            background: "#fff0",
          },
        },
      }}
    />
  );
};
