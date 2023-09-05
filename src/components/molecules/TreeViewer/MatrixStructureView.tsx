import { alpha, Stack, useTheme } from "@mui/material";

import { ArrayStructureView } from "#/components/molecules/TreeViewer/ArrayStructureView";
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

  return (
    <Stack
      sx={{
        width: "fit-content",
        "& > *:not(:last-of-type)": {
          borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.3)}}`,
        },
      }}
    >
      {data.childNames?.map((name) => {
        const data = arrayState[name];
        if (!data) return null;

        return <ArrayStructureView key={name} data={data} isGrid={true} />;
      })}
    </Stack>
  );
};
