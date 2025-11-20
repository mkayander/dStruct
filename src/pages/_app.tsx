import { ApolloProvider } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import React from "react";

import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { apolloClient } from "#/graphql/apolloClient";
import { type I18nProps } from "#/i18n/getI18nProps";
import { api } from "#/shared/api";
import { SnackbarCloseButton } from "#/shared/ui/atoms/SnackbarCloseButton";
import { I18nProvider } from "#/shared/ui/providers/I18nProvider";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import { ReduxProvider } from "#/store/provider";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

type MyAppProps = {
  session: Session | null;
  i18n?: I18nProps;
};

const MyApp: React.FC<AppProps<MyAppProps>> = ({ Component, pageProps }) => {
  return (
    <ReduxProvider>
      <SessionProvider session={pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <StateThemeProvider>
            <SnackbarProvider
              maxSnack={4}
              action={(snackbarKey) => (
                <SnackbarCloseButton snackbarKey={snackbarKey} />
              )}
            >
              <I18nProvider i18n={pageProps.i18n}>
                <ProjectBrowserProvider>
                  <Component {...pageProps} />
                  <ProjectBrowser />
                  <Analytics />
                  <SpeedInsights />
                </ProjectBrowserProvider>
              </I18nProvider>
            </SnackbarProvider>
          </StateThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default api.withTRPC(MyApp);
