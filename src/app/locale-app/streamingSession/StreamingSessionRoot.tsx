"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

const StreamingSessionDispatchContext = createContext<Dispatch<
  SetStateAction<Session | null>
> | null>(null);

type StreamingSessionRootProps = {
  children: ReactNode;
};

/** Keeps SessionProvider mounted while SSR session streams in via Suspense. */
export const StreamingSessionRoot: React.FC<StreamingSessionRootProps> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <StreamingSessionDispatchContext.Provider value={setSession}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </StreamingSessionDispatchContext.Provider>
  );
};

export { StreamingSessionDispatchContext };
