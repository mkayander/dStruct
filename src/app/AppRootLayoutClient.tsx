"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Session } from "next-auth";
import React, { type ReactNode } from "react";
import "symbol-observable";

import { CookieConsentRoot } from "#/features/cookieConsent/ui/CookieConsentRoot";
import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { type I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";
import { AppShellProviders } from "#/shared/ui/providers/AppShellProviders";
import { AppRouterI18nProvider } from "#/shared/ui/providers/I18nProvider";

type AppRootLayoutClientProps = {
  children: ReactNode;
  i18n: I18nProps;
  session: Session | null;
  locale: Locales;
};

/**
 * App Router provider shell. Shares {@link AppShellProviders} with Pages `_app`.
 */
export const AppRootLayoutClient: React.FC<AppRootLayoutClientProps> = ({
  children,
  i18n,
  session,
  locale,
}) => {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <AppShellProviders session={session}>
        <AppRouterI18nProvider locale={locale} i18n={i18n}>
          <CookieConsentRoot>
            <ProjectBrowserProvider>
              {children}
              <ProjectBrowser />
              <Analytics />
              <SpeedInsights />
            </ProjectBrowserProvider>
          </CookieConsentRoot>
        </AppRouterI18nProvider>
      </AppShellProviders>
    </AppRouterCacheProvider>
  );
};
