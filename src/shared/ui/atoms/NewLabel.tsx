import React from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "#/shadcn/ui/tooltip";
import { useI18nContext } from "#/shared/hooks";

type NewLabelProps = {
  createdAt: Date;
};

export const NewLabel: React.FC<NewLabelProps> = ({ createdAt }) => {
  const { LL } = useI18nContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block h-5 rounded-lg bg-green-700 px-1.5 pt-1 text-xs text-white opacity-90 shadow-md">
          {LL.NEW()}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Created at {createdAt.toLocaleString()}</p>
      </TooltipContent>
    </Tooltip>
  );
};
