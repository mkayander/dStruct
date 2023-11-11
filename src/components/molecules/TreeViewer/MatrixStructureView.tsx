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
        borderCollapse: "collapse",
        border: borderColor,
        td: {
          border: borderColor,
        },
      }}
    >
      <tbody>
        {data.childNames?.map((name) => {
          const data = arrayState[name];
          if (!data) return null;

          return <MatrixRow key={name} data={data} />;
        })}
      </tbody>
    </Box>
  );
};
