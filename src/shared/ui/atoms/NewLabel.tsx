import React from "react";

import { useI18nContext } from "#/shared/hooks";

import { Tooltip, TooltipContent, TooltipTrigger } from "#/shadcn/ui/tooltip";

type NewLabelProps = {
  createdAt: Date;
};

export const NewLabel: React.FC<NewLabelProps> = ({ createdAt }) => {
  const { LL } = useI18nContext();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block text-xs px-1.5 pt-1 h-5 text-white bg-green-700 rounded-lg shadow-md opacity-90">
          {LL.NEW()}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Created at {createdAt.toLocaleString()}</p>
      </TooltipContent>
    </Tooltip>
  );
};
