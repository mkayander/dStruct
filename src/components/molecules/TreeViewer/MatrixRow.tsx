import { Box } from "@mui/material";
import React, { useMemo } from "react";

import { ArrayItem } from "#/components/molecules/TreeViewer/ArrayItem";
import { type ArrayStructureViewProps } from "#/components/molecules/TreeViewer/ArrayStructureView";
import { arrayDataItemSelectors } from "#/store/reducers/structures/arrayReducer";

export const MatrixRow: React.FC<ArrayStructureViewProps> = ({ data }) => {
  const items = useMemo(
    () => arrayDataItemSelectors.selectAll(data.nodes),
    [data.nodes],
  );

  return (
    <tr>
      {items.length > 0 ? (
        items.map((item) => (
          <td key={item.id}>
            <ArrayItem
              size={40}
              colorMap={data.colorMap}
              isGrid={true}
              item={item}
            />
          </td>
        ))
      ) : (
        <Box
          sx={{
            width: 44,
            height: 44,
          }}
        />
      )}
    </tr>
  );
};
