import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import React, { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { apolloClient } from "#/graphql/apolloClient";
import { useAppSelector } from "#/store/hooks";
import { wrapper } from "#/store/makeStore";
import { selectIsLightMode } from "#/store/reducers/appBarReducer";
import { themes } from "#/themes";
import type { AppTypeWithLayout } from "#/types/page";
import { trpc } from "#/utils";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

const StateThemeProvider: React.FC<Omit<ThemeProviderProps, "theme">> = (
  props
) => {
  const isLightMode = useAppSelector(selectIsLightMode);

  const theme = useMemo(
    () => (isLightMode ? themes.light : themes.dark),
    [isLightMode]
  );

  return <ThemeProvider theme={theme} {...props} />;
};

const MyApp: AppTypeWithLayout<{ session: Session | null }> = ({
  Component,
  ...restProps
}) => {
  const { store, props } = wrapper.useWrappedStore(restProps);

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={props.pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <StateThemeProvider>
            <SnackbarProvider maxSnack={4}>
              <Head>
                <title>dStruct</title>
              </Head>
              <CssBaseline />
              <Component {...props.pageProps} />
            </SnackbarProvider>
          </StateThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default trpc.withTRPC(MyApp);
