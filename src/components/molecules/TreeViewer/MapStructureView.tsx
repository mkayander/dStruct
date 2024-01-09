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
  const border = `1px solid ${alpha(theme.palette.primary.light, 0.3)}`;
  const items = useMemo(
    () => arrayDataItemSelectors.selectAll(data.nodes),
    [data.nodes],
  );

  return (
    <Box
      component="table"
      sx={{
        width: "fit-content",
        borderCollapse: "collapse",
        border,
        td: {
          // border,
        },
      }}
    >
      <tbody>
        {items.map((item) => (
          <MapItem key={item.id} item={item} colorMap={data.colorMap} />
        ))}
        {items.length === 0 && (
          <Box
            sx={{
              width: 101,
              height: 44,
            }}
          />
        )}
      </tbody>
    </Box>
  );
};
