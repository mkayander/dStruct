"use client";

import { useParams } from "next/navigation";

/** Profile `userId` from App `[userId]` segment. */
export const useProfileUserId = (): string | undefined => {
  const params = useParams();
  const userId = params?.userId;
  return typeof userId === "string" ? userId : undefined;
};
