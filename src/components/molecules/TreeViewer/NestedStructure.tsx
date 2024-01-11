import { Box } from "@mui/material";
import React from "react";

import { MapStructureView } from "#/components/molecules/TreeViewer/MapStructureView";
import { useAppSelector } from "#/store/hooks";
import {
  type ArrayItemData,
  selectArrayStateByName,
} from "#/store/reducers/structures/arrayReducer";

type NestedStructureProps = {
  item: ArrayItemData;
};

export const NestedStructure: React.FC<NestedStructureProps> = ({
  item: { childName },
}) => {
  const data = useAppSelector(selectArrayStateByName(childName ?? ""));

  if (data) {
    return (
      <Box sx={{ p: 0.5 }}>
        <MapStructureView data={data} />
      </Box>
    );
  }

  return null;
};
