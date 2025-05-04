import React from "react";

import { selectIsInitialized } from "#/features/project/model/projectSlice";
import { Skeleton } from "#/shadcn/ui/skeleton";
import { cn } from "#/shared/lib/utils";
import { useAppSelector } from "#/store/hooks";

export const LoadingSkeletonOverlay: React.FC = () => {
  const isInitialized = useAppSelector(selectIsInitialized);
  if (isInitialized) return null;

  return (
    <Skeleton
      className={cn("absolute inset-0 z-10 cursor-wait rounded-md bg-white/5")}
    />
  );
};
