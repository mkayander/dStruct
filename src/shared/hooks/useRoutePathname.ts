"use client";

import { usePathname } from "next/navigation";

/** Current pathname from App Router (`/` when unavailable). */
export const useRoutePathname = (): string => {
  const pathname = usePathname();
  return pathname ?? "/";
};
