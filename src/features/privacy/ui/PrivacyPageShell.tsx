"use client";

import React, { type ReactNode } from "react";

import { MainLayout } from "#/shared/ui/templates/MainLayout";

/** Client chrome for privacy — server-rendered content is passed as `children`. */
export const PrivacyPageShell: React.FC<{ children: ReactNode }> = ({
  children,
}) => <MainLayout>{children}</MainLayout>;
