import { alpha, Box, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { type ArrayStructureViewProps } from "#/entities/dataStructures/array/ui/ArrayStructureView";
import { MapItem } from "#/entities/dataStructures/map/ui/MapItem";
import { arrayDataItemSelectors } from "#/store/reducers/structures/arrayReducer";

type MapStructureViewProps = ArrayStructureViewProps;

export const MapStructureView: React.FC<MapStructureViewProps> = ({
  data,
  parentColorMap,
  sx,
}) => {
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

        "& tr:first-of-type": {
          "& > td:first-of-type": {
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
          "& > td:first-of-type": {
            borderBottomLeftRadius: "4px",
          },
          "& > td:last-child": {
            borderBottomRightRadius: "4px",
          },
          "&::after": {
            borderRadius: "0 0 4px 4px",
          },
        },
        ...sx,
      }}
    >
      <tbody>
        {items.map((item) => (
          <MapItem
            key={item.id}
            item={item}
            colorMap={data.colorMap ?? parentColorMap}
          />
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
