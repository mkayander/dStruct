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
import { I18nProvider } from "#/shared/ui/providers/I18nProvider";
import type { SsrDeviceType } from "#/themes";

import { RuntimeDeviceHintProvider } from "#/app/locale-app/RuntimeDeviceHintContext";

type AppRootLayoutClientProps = {
  children: ReactNode;
  i18n: I18nProps;
  session: Session | null;
  locale: Locales;
  ssrDeviceType?: SsrDeviceType;
};

/**
 * App Router provider shell.
 */
export const AppRootLayoutClient: React.FC<AppRootLayoutClientProps> = ({
  children,
  i18n,
  session,
  locale,
  ssrDeviceType = "desktop",
}) => {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <RuntimeDeviceHintProvider initialSsrDeviceType={ssrDeviceType}>
        <AppShellProviders session={session} ssrDeviceType={ssrDeviceType}>
          <I18nProvider locale={locale} i18n={i18n}>
            <CookieConsentRoot>
              <ProjectBrowserProvider>
                {children}
                <ProjectBrowser />
                <Analytics />
                <SpeedInsights />
              </ProjectBrowserProvider>
            </CookieConsentRoot>
          </I18nProvider>
        </AppShellProviders>
      </RuntimeDeviceHintProvider>
    </AppRouterCacheProvider>
  );
};
