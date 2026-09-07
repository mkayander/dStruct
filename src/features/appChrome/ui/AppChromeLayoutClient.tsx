"use client";

import React, { type ReactNode } from "react";

import { MainLayout } from "#/shared/ui/templates/MainLayout";

type AppChromeLayoutClientProps = {
  children: ReactNode;
};

/**
 * Persistent MainLayout for app routes that need marketing-style chrome
 * (daily) without remounting scroll container on instant navigations.
 */
export const AppChromeLayoutClient: React.FC<AppChromeLayoutClientProps> = ({
  children,
}) => <MainLayout>{children}</MainLayout>;
