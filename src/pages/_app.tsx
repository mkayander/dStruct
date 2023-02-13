import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import React, { useMemo, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { apolloClient } from "#/graphql/apolloClient";
import {
  MainLayout as DefaultLayout,
  type MainLayoutProps,
} from "#/layouts/MainLayout";
import { wrapper } from "#/store/makeStore";
import { themes } from "#/themes";
import type { AppTypeWithLayout } from "#/types/page";
import { trpc } from "#/utils";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  ...restProps
}) => {
  const { store, props } = wrapper.useWrappedStore(restProps);
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [darkMode, setDarkMode] = useState(true);

  const theme = useMemo(
    () => (darkMode ? themes.dark : themes.light),
    [darkMode]
  );

  const Layout: React.FC<MainLayoutProps> = Component.Layout ?? DefaultLayout;

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={props.pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={4}>
              <Head>
                <title>dStruct</title>
              </Head>
              <CssBaseline />
              <Layout setDarkMode={setDarkMode}>
                <Component {...props.pageProps} />
              </Layout>
            </SnackbarProvider>
          </ThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default trpc.withTRPC(MyApp);
