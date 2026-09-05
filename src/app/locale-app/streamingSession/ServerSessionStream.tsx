import { getServerSession } from "next-auth";

import { authOptions } from "#/server/auth/authOptions";

import { SessionStreamReceiver } from "#/app/locale-app/streamingSession/SessionStreamReceiver";

/** Fetches session on the server and streams it into SessionProvider. */
export async function ServerSessionStream() {
  const session = await getServerSession(authOptions);
  return <SessionStreamReceiver session={session} />;
}
