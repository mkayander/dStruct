"use client";

import { ApolloProvider } from "@apollo/client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import React, { type ReactNode } from "react";
import "symbol-observable";

import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { apolloClient } from "#/graphql/apolloClient";
import { type I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";
import { TrpcProvider } from "#/shared/trpc/TrpcProvider";
import { SnackbarCloseButton } from "#/shared/ui/atoms/SnackbarCloseButton";
import { AppRouterI18nProvider } from "#/shared/ui/providers/I18nProvider";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import { isSnackbarClosable } from "#/shared/ui/snackbarClosability";
import { ReduxProvider } from "#/store/provider";

type AppRootLayoutClientProps = {
  children: ReactNode;
  i18n: I18nProps;
  session: Session | null;
  locale: Locales;
};

/**
 * Mirrors `pages/_app` providers for App Router routes (default locale home).
 */
export const AppRootLayoutClient: React.FC<AppRootLayoutClientProps> = ({
  children,
  i18n,
  session,
  locale,
}) => {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <TrpcProvider>
        <ReduxProvider>
          <SessionProvider session={session}>
            <ApolloProvider client={apolloClient}>
              <StateThemeProvider>
                <SnackbarProvider
                  maxSnack={4}
                  action={(snackbarKey) =>
                    isSnackbarClosable(snackbarKey) ? (
                      <SnackbarCloseButton snackbarKey={snackbarKey} />
                    ) : null
                  }
                  classes={{
                    containerAnchorOriginBottomLeft:
                      "snackbar-mobile-bottom-margin",
                    containerAnchorOriginBottomCenter:
                      "snackbar-mobile-bottom-margin",
                    containerAnchorOriginBottomRight:
                      "snackbar-mobile-bottom-margin",
                  }}
                >
                  <AppRouterI18nProvider locale={locale} i18n={i18n}>
                    <ProjectBrowserProvider>
                      {children}
                      <ProjectBrowser />
                      <Analytics />
                      <SpeedInsights />
                    </ProjectBrowserProvider>
                  </AppRouterI18nProvider>
                </SnackbarProvider>
              </StateThemeProvider>
            </ApolloProvider>
          </SessionProvider>
        </ReduxProvider>
      </TrpcProvider>
    </AppRouterCacheProvider>
  );
};
