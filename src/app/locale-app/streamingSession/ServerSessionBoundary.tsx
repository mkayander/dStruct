import { getServerSession } from "next-auth";

import { authOptions } from "#/server/auth/authOptions";

import { SessionGate } from "#/app/locale-app/streamingSession/SessionGate";

/** Resolves session on the server and mounts SessionProvider with the result. */
export async function ServerSessionBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return <SessionGate session={session}>{children}</SessionGate>;
}
