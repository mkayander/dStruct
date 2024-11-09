import { Stack, Typography } from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React from "react";

import { type RouterOutputs } from "#/utils/trpc";

type SolutionComplexityLabelProps = {
  solution: UseQueryResult<RouterOutputs["project"]["getSolutionBySlug"]>;
};

export const SolutionComplexityLabel: React.FC<
  SolutionComplexityLabelProps
> = ({ solution }) => {
  if (!solution.data) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        i: {
          whiteSpace: "nowrap",
          color: "text.secondary",
          fontSize: 11,
          fontWeight: "normal",
        },
      }}
    >
      {solution.data.timeComplexity && (
        <Typography variant="body2" fontWeight="bold">
          <i>TC:</i> {solution.data.timeComplexity}
          {solution.data.spaceComplexity && <i>&nbsp; | </i>}
        </Typography>
      )}
      {solution.data.spaceComplexity && (
        <Typography variant="body2" fontWeight="bold">
          <i>SC:</i> {solution.data.spaceComplexity}
        </Typography>
      )}
    </Stack>
  );
};
