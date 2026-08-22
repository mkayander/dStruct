"use client";

import { useParams } from "next/navigation";

import { usePagesRouterCompat } from "#/shared/hooks/usePagesRouterCompat";

/** Profile `userId` from Pages `query.userId` or App `[userId]` segment. */
export const useProfileUserId = (): string | undefined => {
  const pagesRouter = usePagesRouterCompat();
  const params = useParams();

  if (pagesRouter) {
    return typeof pagesRouter.query.userId === "string"
      ? pagesRouter.query.userId
      : undefined;
  }

  const userId = params?.userId;
  return typeof userId === "string" ? userId : undefined;
};
