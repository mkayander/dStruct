import { alpha, Box, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { MapItem } from "#/components/molecules/TreeViewer/MapItem";
import {
  type ArrayData,
  arrayDataItemSelectors,
} from "#/store/reducers/structures/arrayReducer";

type MapStructureViewProps = {
  data: ArrayData;
};

export const MapStructureView: React.FC<MapStructureViewProps> = ({ data }) => {
  const theme = useTheme();
  const items = useMemo(
    () => arrayDataItemSelectors.selectAll(data.nodes),
    [data.nodes],
  );

  return (
    <Box
      component="table"
      sx={{
        width: "fit-content",
        borderCollapse: "separate",
        borderSpacing: 0,
        border: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
        borderRadius: "4px",
        "&:hover": {
          border: `1px solid ${alpha(theme.palette.primary.light, 0.8)}`,
        },

        "& tr:first-child": {
          "& > td:first-child": {
            borderTopLeftRadius: "4px",
          },
          "& > td:last-child": {
            borderTopRightRadius: "4px",
          },
          "&::after": {
            borderRadius: "4px 4px 0 0",
          },
        },
        "& tr:last-child": {
          "& > td:first-child": {
            borderBottomLeftRadius: "4px",
          },
          "& > td:last-child": {
            borderBottomRightRadius: "4px",
          },
          "&::after": {
            borderRadius: "0 0 4px 4px",
          },
        },
      }}
    >
      <tbody>
        {items.map((item) => (
          <MapItem key={item.id} item={item} colorMap={data.colorMap} />
        ))}
        {items.length === 0 && (
          <tr>
            <Box
              component="td"
              sx={{
                width: 44,
                height: 44,
              }}
            />
          </tr>
        )}
      </tbody>
    </Box>
  );
};
