import { Box, Stack, type SxProps, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { ArrayItem } from "#/components/molecules/TreeViewer/ArrayItem";
import {
  type ArrayData,
  arrayDataItemSelectors,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

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
          // verticalAlign: "middle",
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
  sx?: SxProps;
};

export const ArrayStructureView: React.FC<ArrayStructureViewProps> = ({
  data,
}) => {
  const items = useMemo(() => {
    return arrayDataItemSelectors.selectAll(data.nodes);
  }, [data.nodes]);

  const { argType } = data;
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
      <ArrayBracket argType={argType} />
      <Stack direction="row">
        {items.length > 0 ? (
          items.map((item) => (
            <ArrayItem key={item.id} colorMap={data.colorMap} item={item} />
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
