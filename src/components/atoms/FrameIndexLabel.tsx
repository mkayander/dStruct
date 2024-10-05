import { Typography } from "@mui/material";

import { useAppSelector } from "#/store/hooks";
import { selectCallstackFrameIndex } from "#/store/reducers/callstackReducer";

export const FrameIndexLabel = () => {
  const frameIndex = useAppSelector(selectCallstackFrameIndex);

  return (
    <Typography variant="caption" minWidth="3ch">
      {frameIndex}
    </Typography>
  );
};
