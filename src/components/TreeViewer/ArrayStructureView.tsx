import { Box, Stack, type SxProps } from "@mui/material";
import { type EntityState } from "@reduxjs/toolkit";
import React, { useMemo } from "react";

import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";

type ArrayStructureViewProps = {
  arrayName: string;
  entityState: EntityState<ArrayItemData>;
  playbackInterval: number;
  replayCount: number;
  sx?: SxProps;
};

export const ArrayStructureView: React.FC<ArrayStructureViewProps> = ({
  entityState,
}) => {
  const items = useMemo(() => {
    return arrayDataItemSelectors.selectAll(entityState);
  }, [entityState]);

  return (
    <Stack direction="row" spacing={1}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            width: 50,
            height: 50,
            backgroundColor: item.color,
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item.value}
        </Box>
      ))}
    </Stack>
  );
};
