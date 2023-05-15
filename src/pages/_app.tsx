import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import React, { useMemo } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { apolloClient } from "#/graphql/apolloClient";
import TypesafeI18n from "#/i18n/i18n-react";
import type { Locales } from "#/i18n/i18n-types";
import { loadedLocales } from "#/i18n/i18n-util";
import { loadFormatters } from "#/i18n/i18n-util.sync";
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

  props.pageProps.i18n ??= {
    locale: "en",
    dictionary: {},
    isStub: true,
  };
  const locale: Locales = props.pageProps.i18n.locale;
  loadedLocales[locale] = props.pageProps.i18n.dictionary;
  loadFormatters(locale);

  return (
    <ReduxProvider store={store}>
      <SessionProvider session={props.pageProps.session}>
        <ApolloProvider client={apolloClient}>
          <StateThemeProvider>
            <SnackbarProvider maxSnack={4}>
              <TypesafeI18n locale={locale}>
                <CssBaseline />
                <Component {...props.pageProps} />
                <Analytics />
              </TypesafeI18n>
            </SnackbarProvider>
          </StateThemeProvider>
        </ApolloProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default trpc.withTRPC(MyApp);
