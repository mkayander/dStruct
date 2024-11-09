import { Typography } from "@mui/material";

import { selectCallstackFrameIndex } from "#/features/callstack/model/callstackSlice";
import { useAppSelector } from "#/store/hooks";

export const FrameIndexLabel = () => {
  const frameIndex = useAppSelector(selectCallstackFrameIndex);

  return (
    <Typography variant="caption" minWidth="3ch">
      {frameIndex}
    </Typography>
  );
};
