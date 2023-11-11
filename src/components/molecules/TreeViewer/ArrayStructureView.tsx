import { Box, Stack, type SxProps, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { ArrayItem } from "#/components/molecules/TreeViewer/ArrayItem";
import {
  type ArrayData,
  arrayDataItemSelectors,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

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
        marginRight: side === "left" ? "-12px" : 0,
        marginLeft: side === "left" ? 0 : "-12px",
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

export type ArrayStructureViewProps = {
  data: ArrayData;
  sx?: SxProps;
};

export const ArrayStructureView: React.FC<ArrayStructureViewProps> = ({
  data,
}) => {
  const items = useMemo(() => {
    return arrayDataItemSelectors.selectAll(data.nodes);
  }, [data.nodes]);

  const isArray = data.argType === ArgumentType.ARRAY;

  return (
    <Stack
      direction="row"
      sx={{
        zIndex: 10,
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
      {isArray ? <ArrayBracket /> : <Typography>&quot;</Typography>}
      <Stack direction="row">
        {items.length > 0 ? (
          items.map((item) => (
            <ArrayItem key={item.id} colorMap={data.colorMap} {...item} />
          ))
        ) : (
          <Box
            sx={{
              width: 32,
              height: 12,
            }}
          />
        )}
      </Stack>
      {isArray ? (
        <ArrayBracket side="right" />
      ) : (
        <Typography>&quot;</Typography>
      )}
    </Stack>
  );
};
