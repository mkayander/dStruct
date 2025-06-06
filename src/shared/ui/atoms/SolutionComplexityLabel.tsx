import { type UseQueryResult } from "@tanstack/react-query";
import React from "react";

import { type RouterOutputs } from "#/shared/lib/trpc";

type SolutionComplexityLabelProps = {
  solution: UseQueryResult<RouterOutputs["project"]["getSolutionBySlug"]>;
};

export const SolutionComplexityLabel: React.FC<
  SolutionComplexityLabelProps
> = ({ solution }) => {
  if (!solution.data) return null;

  return (
    <div className="flex flex-row items-center gap-1">
      {solution.data.timeComplexity && (
        <span className="text-sm font-bold">
          <i className="text-muted-foreground text-xs font-normal whitespace-nowrap">
            TC:
          </i>{" "}
          {solution.data.timeComplexity}
          {solution.data.spaceComplexity && (
            <i className="text-muted-foreground text-xs font-normal whitespace-nowrap">
              {" "}
              |{" "}
            </i>
          )}
        </span>
      )}
      {solution.data.spaceComplexity && (
        <span className="text-sm font-bold">
          <i className="text-muted-foreground text-xs font-normal whitespace-nowrap">
            SC:
          </i>{" "}
          {solution.data.spaceComplexity}
        </span>
      )}
    </div>
  );
};
