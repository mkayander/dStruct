import { Box, Stack, type SxProps, useTheme } from "@mui/material";
import { type EntityState } from "@reduxjs/toolkit";
import React, { useMemo } from "react";

import { ArrayItem } from "#/components/TreeViewer/ArrayItem";
import { useNodesRuntimeUpdates } from "#/hooks";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
  arrayStructureSlice,
} from "#/store/reducers/structures/arrayReducer";

type ArrayBracketProps = {
  side?: "left" | "right";
};

const ArrayBracket: React.FC<ArrayBracketProps> = ({ side = "left" }) => {
  const theme = useTheme();
  const borderStyle = `2px solid ${theme.palette.primary.light}`;

  return (
    <Box
      className="array-bracket"
      sx={{
        width: 12,
        height: 42,
        marginRight: "-12px",
        marginLeft: "-12px",
        borderRadius: "2px 0 0 2px",
        borderLeft: borderStyle,
        borderTop: borderStyle,
        borderBottom: borderStyle,
        opacity: 0.6,
        transition: "opacity 0.1s",
        zIndex: 10,
        pointerEvents: "none",
        transform: side === "left" ? "none" : "rotate(180deg)",
      }}
    />
  );
};

type ArrayStructureViewProps = {
  arrayName: string;
  entityState: EntityState<ArrayItemData>;
  playbackInterval: number;
  replayCount: number;
  sx?: SxProps;
};

export const ArrayStructureView: React.FC<ArrayStructureViewProps> = ({
  arrayName,
  entityState,
  playbackInterval,
  replayCount,
}) => {
  useNodesRuntimeUpdates(
    arrayName,
    arrayStructureSlice,
    playbackInterval,
    replayCount
  );

  const items = useMemo(() => {
    return arrayDataItemSelectors.selectAll(entityState);
  }, [entityState]);

  return (
    <Stack
      direction="row"
      sx={{
        "&:hover": {
          ".array-bracket": {
            opacity: 1,
          },
          ".array-item": {
            "&::before": {
              opacity: 1,
            },
          },
        },
      }}
    >
      <ArrayBracket />
      <Stack direction="row">
        {items.map((item) => (
          <ArrayItem key={item.id} {...item} />
        ))}
      </Stack>
      <ArrayBracket side="right" />
    </Stack>
  );
};