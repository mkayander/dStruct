import { Box, Stack, type SxProps, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  type ArrayData,
  arrayDataItemSelectors,
} from "#/store/reducers/structures/arrayReducer";

import { ArrayItem } from "./ArrayItem";

type ArrayBracketProps = {
  argType: ArgumentType;
  side?: "left" | "right";
};

const ArrayBracket: React.FC<ArrayBracketProps> = ({
  argType,
  side = "left",
}) => {
  const theme = useTheme();
  if (argType === ArgumentType.SET) {
    const char = side === "left" ? "<" : ">";
    return (
      <Typography
        component="span"
        className="array-bracket"
        color="primary.light"
        fontSize={26}
        fontWeight={200}
        sx={{
          display: "inline-block",
          height: 37,
          opacity: 0.6,
          transform: "scale(0.8, 2)",
        }}
      >
        {char}
      </Typography>
    );
  }
  if (argType === ArgumentType.STRING) {
    return <Typography>&quot;</Typography>;
  }

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
  parentColorMap?: ArrayData["colorMap"];
  sx?: SxProps;
};

export const ArrayStructureView: React.FC<ArrayStructureViewProps> = ({
  data,
  parentColorMap,
}) => {
  const items = useMemo(() => {
    return arrayDataItemSelectors.selectAll(data.nodes);
  }, [data.nodes]);

  const { argType } = data;

  return (
    <Stack
      direction="row"
      sx={{
        width: "fit-content",
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
      <ArrayBracket argType={argType} />
      <Stack direction="row">
        {items.length > 0 ? (
          items.map((item) => (
            <ArrayItem
              key={item.id}
              colorMap={data.colorMap ?? parentColorMap}
              item={item}
            />
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
      <ArrayBracket argType={argType} side="right" />
    </Stack>
  );
};
