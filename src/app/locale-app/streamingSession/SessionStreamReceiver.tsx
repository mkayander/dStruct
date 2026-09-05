"use client";

import type { Session } from "next-auth";
import type React from "react";
import { useContext, useLayoutEffect } from "react";

import { StreamingSessionDispatchContext } from "#/app/locale-app/streamingSession/StreamingSessionRoot";

type SessionStreamReceiverProps = {
  session: Session | null;
};

/** Applies streamed server session to the mounted SessionProvider (no provider remount). */
export const SessionStreamReceiver: React.FC<SessionStreamReceiverProps> = ({
  session,
}) => {
  const setSession = useContext(StreamingSessionDispatchContext);

  useLayoutEffect(() => {
    setSession?.(session);
  }, [session, setSession]);

  return null;
};
