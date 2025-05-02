import { ApolloProvider } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import { apolloClient } from "#/graphql/apolloClient";
import { type I18nProps } from "#/i18n/getI18nProps";
import { trpc } from "#/shared/lib";
import { SnackbarCloseButton } from "#/shared/ui/atoms/SnackbarCloseButton";
import { TooltipProvider } from "#/shared/ui/atoms/Tooltip";
import { I18nProvider } from "#/shared/ui/providers/I18nProvider";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import { ThemeProvider } from "#/shared/ui/providers/theme";
import { wrapper } from "#/store/makeStore";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

type MyAppProps = {
  session: Session | null;
  i18n?: I18nProps;
};

const MyApp: React.FC<AppProps<MyAppProps>> = ({ Component, ...restProps }) => {
  const { store, props } = wrapper.useWrappedStore(restProps);

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={props.pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider>
            <StateThemeProvider>
              <SnackbarProvider
                maxSnack={4}
                action={(snackbarKey) => (
                  <SnackbarCloseButton snackbarKey={snackbarKey} />
                )}
              >
                <I18nProvider i18n={props.pageProps.i18n}>
                  <TooltipProvider delayDuration={200}>
                    <Component {...props.pageProps} />
                    <Analytics />
                    <SpeedInsights />
                  </TooltipProvider>
                </I18nProvider>
              </SnackbarProvider>
            </StateThemeProvider>
          </ThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default trpc.withTRPC(MyApp);
