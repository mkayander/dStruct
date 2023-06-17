import { ApolloProvider } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import { StateThemeProvider } from "#/components";
import { apolloClient } from "#/graphql/apolloClient";
import TypesafeI18n from "#/i18n/i18n-react";
import type { Locales } from "#/i18n/i18n-types";
import { loadedLocales } from "#/i18n/i18n-util";
import { loadFormatters } from "#/i18n/i18n-util.sync";
import { wrapper } from "#/store/makeStore";
import type { AppTypeWithLayout } from "#/types/page";
import { trpc } from "#/utils";

import "#/styles/globals.css";

import "overlayscrollbars/overlayscrollbars.css";

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
