import { Box, Stack, type SxProps, Typography, useTheme } from "@mui/material";
import { type EntityState } from "@reduxjs/toolkit";
import React, { useMemo } from "react";

import {
  arrayDataItemSelectors,
  type ArrayItemData,
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
  entityState,
}) => {
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
          <Box
            key={item.id}
            className="array-item"
            sx={{
              position: "relative",
              width: 42,
              height: 42,
              marginLeft: "1px",
              backgroundColor: item.color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              "&::after": {
                content: '""',
                position: "absolute",
                zIndex: 15,
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.1)",
                opacity: 0,
                transition: "opacity 0.1s",
                mixBlendMode: "difference",
                backdropFilter: "blur(2px)",
              },

              "&:hover::after": {
                opacity: 0.3,
              },

              "&:not(:last-child)": {
                "&::before": {
                  content: '""',
                  position: "absolute",
                  right: -1,
                  width: "1px",
                  height: 32,
                  backgroundColor: "primary.light",
                  opacity: 0.6,
                },
              },
            }}
          >
            <Typography sx={{ pt: 0.32 }}>{item.value}</Typography>
          </Box>
        ))}
      </Stack>
      <ArrayBracket side="right" />
    </Stack>
  );
};
