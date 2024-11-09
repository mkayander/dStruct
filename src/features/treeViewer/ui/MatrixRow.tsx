import { alpha, Box, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import { ArrayItem } from "#/entities/dataStructures/array/ui/ArrayItem";
import { type ArrayStructureViewProps } from "#/entities/dataStructures/array/ui/ArrayStructureView";
import { arrayDataItemSelectors } from "#/store/reducers/structures/arrayReducer";

type MatrixRowProps = ArrayStructureViewProps & {
  header?: string;
};

export const MatrixRow: React.FC<MatrixRowProps> = ({
  data,
  header,
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
      component="tr"
      sx={{
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.light, 0.032),
        },
        ...sx,
      }}
    >
      {header ? <th scope="row">{header}</th> : null}
      {items.length > 0 ? (
        items.map((item) => (
          <td key={item.id}>
            <ArrayItem
              colorMap={data.colorMap ?? parentColorMap}
              isGrid={true}
              item={item}
            />
          </td>
        ))
      ) : (
        <Box
          component="td"
          sx={{
            width: 44,
            height: 44,
          }}
        />
      )}
    </Box>
  );
};
