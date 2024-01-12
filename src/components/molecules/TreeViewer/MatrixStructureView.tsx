import { alpha, Box, useTheme } from "@mui/material";
import React from "react";

import { MatrixRow } from "#/components/molecules/TreeViewer/MatrixRow";
import {
  type ArrayData,
  type ArrayDataState,
} from "#/store/reducers/structures/arrayReducer";

type MatrixStructureViewProps = {
  data: ArrayData;
  arrayState: ArrayDataState;
};

export const MatrixStructureView: React.FC<MatrixStructureViewProps> = ({
  data,
  arrayState,
}) => {
  const theme = useTheme();
  const borderColor = `1px solid ${alpha(theme.palette.primary.light, 0.3)}`;

  return (
    <Box
      component="table"
      sx={{
        width: "fit-content",
        borderCollapse: "separate",
        borderSpacing: 0,
        border: borderColor,
        borderRadius: "4px",
        td: {
          "&:not(:last-child)": {
            borderRight: borderColor,
          },
        },
        tr: {
          "&:not(:last-child)": {
            td: {
              borderBottom: borderColor,
            },
          },
        },

        "& tr:first-child": {
          "& > td:first-child": {
            borderTopLeftRadius: "4px",
            ".array-item::after": {
              borderRadius: "4px 0 0 0",
            },
          },
          "& > td:last-child": {
            borderTopRightRadius: "4px",
            ".array-item::after": {
              borderRadius: "0 4px 0 0",
            },
          },
        },
        "& tr:last-child": {
          "& > td:first-child": {
            borderBottomLeftRadius: "4px",
            ".array-item::after": {
              borderRadius: "0 0 0 4px",
            },
          },
          "& > td:last-child": {
            borderBottomRightRadius: "4px",
            ".array-item::after": {
              borderRadius: "0 0 4px 0",
            },
          },
        },
      }}
    >
      <tbody>
        {data.nodes.ids.map((id) => {
          const name = data.nodes.entities[id]?.childName ?? "";
          const nodeData = arrayState[name];
          if (!nodeData) return null;

          return <MatrixRow key={name} data={nodeData} />;
        })}
      </tbody>
    </Box>
  );
};
