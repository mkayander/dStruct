import type { Session } from "next-auth";

/** Profile href for the side drawer; null when the session has no stable user id. */
export function sidePanelProfileHref(
  session: Session | null | undefined,
): string | null {
  const userId = session?.user?.id;
  return userId ? `/profile/${userId}` : null;
}
