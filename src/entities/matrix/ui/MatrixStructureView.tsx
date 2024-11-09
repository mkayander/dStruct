import { alpha, Box, useTheme } from "@mui/material";
import React from "react";

import { MatrixRow } from "#/entities/matrix/ui/MatrixRow";
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
      sx={{
        overflow: "hidden",
      }}
    >
      <Box
        component="table"
        sx={{
          width: "fit-content",
          borderCollapse: "collapse",
          borderSpacing: 0,
          border: borderColor,
          borderRadius: "4px",
          boxSizing: "border-box",
          th: {
            padding: 1,
            textAlign: "center",
            borderBottom: borderColor,
            borderRight: borderColor,
            fontWeight: "light",
            fontSize: "12px",
            lineHeight: "12px",
            color: theme.palette.text.secondary,
            backgroundColor: alpha(theme.palette.action.active, 0.01),

            "&[scope='row']": {
              borderRightWidth: 2,
            },
            "&[scope='col']": {
              borderBottomWidth: 2,

              "&:first-of-type": {
                borderRightWidth: 2,
              },
            },
          },
          td: {
            position: "relative",
            padding: 0,
            border: borderColor,

            "&:hover::after": {
              content: '""',
              position: "absolute",
              top: "-5000px",
              left: 0,
              width: "100%",
              height: "10000px",
              backgroundColor: alpha(theme.palette.primary.light, 0.032),
            },
          },
        }}
      >
        <thead>
          <tr>
            {data.colHeaders ? (
              <>
                <th scope="col" />
                {data.colHeaders.map((value, index) => (
                  <th key={index} scope="col">
                    {value}
                  </th>
                ))}
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {items.map((node, index) => {
            if (!node) return null;

            const name = node.childName ?? "";
            const nodeData = arrayState[name];
            const header = data.rowHeaders?.[node.index];
            if (nodeData) {
              return (
                <MatrixRow
                  key={name}
                  header={header}
                  data={nodeData}
                  parentColorMap={data.colorMap}
                />
              );
            }

            return (
              <Box key={index} component="tr" height={43}>
                {header ? <th scope="row">{header}</th> : null}
              </Box>
            );
          })}
        </tbody>
      </Box>
    </Box>
  );
};
