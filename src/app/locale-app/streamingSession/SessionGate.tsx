"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { type ReactNode } from "react";

type SessionGateProps = {
  /** `undefined` = loading + client refetch; `null` = signed out; session = signed in. */
  session: Session | null | undefined;
  children: ReactNode;
};

/**
 * Mounts next-auth SessionProvider with the server-resolved session on first paint.
 * next-auth v4 reads `session` only in the provider's initial state — do not rely on
 * later prop updates; wrap in Suspense and remount via ServerSessionBoundary instead.
 */
export const SessionGate: React.FC<SessionGateProps> = ({
  session,
  children,
}) => <SessionProvider session={session}>{children}</SessionProvider>;
