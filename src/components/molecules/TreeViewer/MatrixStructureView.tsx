import { alpha, Box, useTheme } from "@mui/material";
import React from "react";

import { MatrixRow } from "#/components/molecules/TreeViewer/MatrixRow";
import type {
  ArrayData,
  ArrayDataState,
  ArrayItemData,
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
  const lastNode = data.nodes.entities[String(data.nodes.ids.at(-1))];
  const lastIndex = lastNode?.index ?? 0;

  const dataArray = data.nodes.ids.map((id) => data.nodes.entities[id]);
  const items = new Array<ArrayItemData | undefined>(lastIndex + 1);
  dataArray.forEach((node) => {
    if (node) {
      items[node.index] = node;
    }
  });

  return (
    <Box
      component="table"
      sx={{
        width: "fit-content",
        borderCollapse: "collapse",
        borderSpacing: 0,
        border: borderColor,
        borderRadius: "4px",
        td: {
          padding: 0,
          border: borderColor,
        },
      }}
    >
      <tbody>
        {items.map((node, index) => {
          if (!node) return null;

          const name = node.childName ?? "";
          const nodeData = arrayState[name];
          if (nodeData) {
            return <MatrixRow key={name} data={nodeData} />;
          }

          return <Box key={index} component="tr" height={44} />;
        })}
      </tbody>
    </Box>
  );
};
